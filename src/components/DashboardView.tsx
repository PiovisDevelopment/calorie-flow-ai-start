
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, LineChart, Settings, Camera, LogOut, X, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface NutritionPlan {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
}

interface LoggedItem {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  description?: string;
  health_suggestion?: string;
  timestamp: string;
  imageUrl?: string;
}

interface DailyLogs {
  [date: string]: LoggedItem[];
}

const DashboardView = () => {
  const navigate = useNavigate();
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [consumed, setConsumed] = useState({ calories: 0, carbs: 0, protein: 0, fats: 0 });
  const [recentItems, setRecentItems] = useState<LoggedItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [showCamera, setShowCamera] = useState(false);
  const [foodLogs, setFoodLogs] = useState<DailyLogs>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Generate week days dynamically based on selected date
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(selectedDate);
    // Get to the beginning of the week (Sunday as day 0)
    date.setDate(date.getDate() - date.getDay() + i);
    return {
      letter: ["S", "M", "T", "W", "T", "F", "S"][i],
      day: i,
      date: date.getDate(),
      fullDate: new Date(date)
    };
  });
  
  // Format date for localStorage key
  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Calculate remaining macros
  const remaining = {
    calories: nutritionPlan ? nutritionPlan.calories - consumed.calories : 0,
    carbs: nutritionPlan ? nutritionPlan.carbs - consumed.carbs : 0,
    protein: nutritionPlan ? nutritionPlan.protein - consumed.protein : 0,
    fats: nutritionPlan ? nutritionPlan.fats - consumed.fats : 0
  };
  
  // Load nutrition plan and food logs from localStorage
  useEffect(() => {
    // Load nutrition plan
    const planData = localStorage.getItem("userNutritionPlan");
    if (planData) {
      setNutritionPlan(JSON.parse(planData));
    }
    
    // Load food logs
    const logsData = localStorage.getItem("foodLogs");
    if (logsData) {
      setFoodLogs(JSON.parse(logsData));
    }
  }, []);
  
  // Update consumed values and recent items when selectedDate or foodLogs change
  useEffect(() => {
    const dateKey = formatDateKey(selectedDate);
    const todaysLogs = foodLogs[dateKey] || [];
    
    // Calculate consumed values for selected date
    const dailyConsumed = todaysLogs.reduce((total, item) => {
      return {
        calories: total.calories + (item.calories || 0),
        carbs: total.carbs + (item.carbs || 0),
        protein: total.protein + (item.protein || 0),
        fats: total.fats + (item.fats || 0)
      };
    }, { calories: 0, carbs: 0, protein: 0, fats: 0 });
    
    setConsumed(dailyConsumed);
    setRecentItems(todaysLogs.slice(0, 5));
    
  }, [selectedDate, foodLogs]);
  
  const handleDaySelect = (day: number, date: Date) => {
    setSelectedDay(day);
    setSelectedDate(date);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedDay(date.getDay());
      setCalendarOpen(false);
    }
  };
  
  const handleOpenCamera = async () => {
    setShowCamera(true);
    setImagePreview(null);
    
    // We'll start the camera when the modal opens
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        toast.error("Camera access not available on this device");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Failed to access camera. Please try again or use file upload.");
    }
  };
  
  const handleCloseCamera = () => {
    // Stop the camera stream when closing
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setShowCamera(false);
    setImagePreview(null);
  };
  
  const handleCaptureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame on the canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get data URL from canvas in PNG format
        const imageDataUrl = canvas.toDataURL('image/png');
        setImagePreview(imageDataUrl);
        
        // Stop the camera stream after capturing
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleAnalyzeImage = async () => {
    if (!imagePreview) return;
    
    try {
      setIsProcessing(true);
      
      console.log("Starting image analysis...");
      
      // Convert dataURL to blob
      const dataURLToBlob = (dataURL: string) => {
        const parts = dataURL.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        
        return new Blob([uInt8Array], { type: contentType });
      };
      
      // Convert to blob
      const blob = dataURLToBlob(imagePreview);
      console.log("Blob created:", blob.type, blob.size);
      
      // Create FormData
      const formData = new FormData();
      
      // Use 'Image' (capital I) to match the OpenAI node's expectation
      formData.append('Image', blob, 'food-image.png');
      
      console.log("FormData created with image");
      
      // Send without Content-Type header
      const response = await fetch("https://n8npro.ngrok.app/webhook/ef6ba5e1-6af8-40b9-8617-d6abc6c47331", {
        method: "POST",
        body: formData
        // No headers - let browser handle Content-Type with proper boundary
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Navigate to results page with the data
        navigate("/results", { 
          state: { 
            result: {
              ...data.output || data, // Handle both formats
              image: imagePreview
            }
          } 
        });
        
        console.log("Analysis successful, navigating to results page");
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      
      toast.error("Failed to analyze image", {
        description: "Would you like to continue with estimated values?",
        action: {
          label: "Continue",
          onClick: () => {
            // Fallback data
            const fallbackData = {
              description: "This is an estimated analysis as we couldn't process your image.",
              health_suggestion: "Consider consulting a nutritionist for accurate dietary advice.",
              calories: 250,
              carbs: 30,
              protein: 15,
              fats: 10
            };
            
            navigate("/results", { 
              state: { 
                result: {
                  ...fallbackData,
                  image: imagePreview
                }
              } 
            });
          }
        }
      });
    } finally {
      setIsProcessing(false);
      setShowCamera(false);
    }
  };
  
  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.clear();
    
    // Show toast notification
    toast.success("Logged out successfully");
    
    // Redirect to the onboarding page
    navigate("/onboarding");
  };
  
  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);
  
  // Helper function to ensure strokeDashoffset is never NaN
  const calculateStrokeDashOffset = (consumed: number, total: number | undefined): number => {
    if (!total || isNaN(total) || total === 0) return 25; // Default fallback
    const percentage = (consumed / total) * 100;
    return Math.max(0, 100 - percentage);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <div className="max-w-md mx-auto w-full">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white p-4 shadow-sm flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-bold text-xl">Cal AI</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                  <Calendar className="h-4 w-4" />
                  <span className="sr-only">Open calendar</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {/* Week Calendar */}
            <div className="flex space-x-2 overflow-x-auto mx-2">
              {weekDays.map((day) => (
                <div 
                  key={day.letter + day.date}
                  onClick={() => handleDaySelect(day.day, day.fullDate)}
                  className={`flex flex-col items-center justify-center w-8 h-8 rounded-full text-xs cursor-pointer
                    ${selectedDay === day.day 
                      ? "bg-black text-white" 
                      : "border border-dashed border-gray-300"}`}
                >
                  <span>{day.letter}</span>
                  <span>{day.date}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Streak Indicator */}
          <div className="flex items-center">
            <span className="bg-amber-100 text-amber-800 p-1 px-2 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68z" clipRule="evenodd" />
              </svg>
              1
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-4 py-2 max-w-md mx-auto w-full">
        {/* Date Display */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-medium">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </h2>
        </div>
        
        {/* Calorie Summary Card */}
        <Card className="w-full shadow-sm rounded-xl mb-4 overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold">{consumed.calories}</h1>
              <p className="text-gray-600">Calories consumed</p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f3f3" strokeWidth="2"></circle>
                <circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  stroke="#000" 
                  strokeWidth="2" 
                  strokeDasharray="100 100" 
                  strokeDashoffset={calculateStrokeDashOffset(consumed.calories, nutritionPlan?.calories)}
                ></circle>
                <circle cx="18" cy="18" r="1.5" fill="#000"></circle>
              </svg>
            </div>
          </div>
        </Card>
        
        {/* Macro Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Protein Card */}
          <Card className="shadow-sm rounded-xl overflow-hidden">
            <div className="p-3">
              <div className="text-left">
                <span className="font-bold">{consumed.protein}g</span>
                <span className="text-sm font-semibold"> Protein</span>
              </div>
              <div className="flex justify-center mt-2">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f3f3" strokeWidth="2"></circle>
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke="#f87171" 
                      strokeWidth="2" 
                      strokeDasharray="100" 
                      strokeDashoffset={calculateStrokeDashOffset(consumed.protein, nutritionPlan?.protein)}
                      strokeLinecap="round"
                    ></circle>
                    <circle cx="18" cy="18" r="1.5" fill="#f87171"></circle>
                  </svg>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Carbs Card */}
          <Card className="shadow-sm rounded-xl overflow-hidden">
            <div className="p-3">
              <div className="text-left">
                <span className="font-bold">{consumed.carbs}g</span>
                <span className="text-sm font-semibold"> Carbs</span>
              </div>
              <div className="flex justify-center mt-2">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f3f3" strokeWidth="2"></circle>
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke="#fbbf24" 
                      strokeWidth="2" 
                      strokeDasharray="100" 
                      strokeDashoffset={calculateStrokeDashOffset(consumed.carbs, nutritionPlan?.carbs)}
                      strokeLinecap="round"
                    ></circle>
                    <circle cx="18" cy="18" r="1.5" fill="#fbbf24"></circle>
                  </svg>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Fats Card */}
          <Card className="shadow-sm rounded-xl overflow-hidden">
            <div className="p-3">
              <div className="text-left">
                <span className="font-bold">{consumed.fats}g</span>
                <span className="text-sm font-semibold"> Fat</span>
              </div>
              <div className="flex justify-center mt-2">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f3f3" strokeWidth="2"></circle>
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke="#60a5fa" 
                      strokeWidth="2" 
                      strokeDasharray="100" 
                      strokeDashoffset={calculateStrokeDashOffset(consumed.fats, nutritionPlan?.fats)}
                      strokeLinecap="round"
                    ></circle>
                    <circle cx="18" cy="18" r="1.5" fill="#60a5fa"></circle>
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Progress indicator dots */}
        <div className="flex justify-center space-x-1 mb-6">
          <div className="w-2 h-2 bg-black rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Recently Logged */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Recently logged</h2>
          {recentItems.length > 0 ? (
            <div className="overflow-x-auto flex space-x-4 pb-2">
              {recentItems.map((item) => (
                <Card key={item.id} className="shadow-sm rounded-xl min-w-[200px]">
                  <div className="flex items-center p-3">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover mr-3" 
                      />
                    )}
                    <div>
                      <h3 className="font-semibold truncate max-w-[130px]">
                        {item.description ? item.description.split('.')[0] : item.name}
                      </h3>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">{item.calories} kcal</span>
                        <span className="text-xs text-gray-500">{item.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No items logged for {selectedDate.toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      
      {/* Floating camera button in the red circle area */}
      <div className="fixed bottom-24 right-4 z-20">
        <Button
          onClick={handleOpenCamera}
          variant="default"
          className="h-16 w-16 rounded-full shadow-lg bg-black hover:bg-black/90 flex items-center justify-center"
        >
          <Camera className="h-8 w-8 text-white" />
        </Button>
      </div>
      
      {/* Bottom Navigation - Centered in the max-width container */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto flex justify-evenly items-center p-3">
          <Button variant="ghost" className="flex flex-col items-center p-1">
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center p-1">
            <LineChart className="h-5 w-5" />
            <span className="text-xs mt-1">Progress</span>
          </Button>
          <div className="flex space-x-4">
            <Button variant="ghost" className="flex flex-col items-center p-1">
              <Settings className="h-5 w-5" />
              <span className="text-xs mt-1">Settings</span>
            </Button>
            <Button 
              onClick={handleLogout}
              variant="ghost" 
              className="flex flex-col items-center p-1"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs mt-1">Logout</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Camera View Modal */}
      <div className={`fixed inset-0 bg-black/95 z-50 flex flex-col transition-opacity duration-300 ${showCamera ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex-1 relative p-4">
          <div className="text-white text-center pt-4 pb-6">
            <h2 className="text-xl font-bold mb-1">Take a photo of your meal</h2>
            <p className="text-sm text-gray-300">Position your meal in the frame and tap capture</p>
          </div>
          
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="absolute inset-0 h-full w-full object-contain pt-20 pb-20"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pt-10 pb-20">
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 z-10"
              />
            </div>
          )}
        </div>
        <div className="p-4 pb-8 flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={handleCloseCamera} 
            className="bg-white/10 hover:bg-white/20 text-white border-none rounded-full py-6 px-8 w-[140px] flex items-center justify-center"
          >
            <X className="h-5 w-5 mr-2" />
            Cancel
          </Button>
          
          {imagePreview ? (
            <Button 
              onClick={handleAnalyzeImage}
              disabled={isProcessing}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-full py-6 px-8 w-[140px] flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Process
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleCaptureImage}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-full py-6 px-8 w-[140px] flex items-center justify-center"
            >
              <Camera className="h-5 w-5 mr-2" />
              Capture
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
