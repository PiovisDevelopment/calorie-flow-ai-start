
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, LineChart, Settings, Camera, CircleDot } from "lucide-react";

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
  timestamp: string;
  imageUrl?: string;
}

const DashboardView = () => {
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [consumed, setConsumed] = useState({ calories: 0, carbs: 0, protein: 0, fats: 0 });
  const [recentItems, setRecentItems] = useState<LoggedItem[]>([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [showCamera, setShowCamera] = useState(false);
  
  // Days of the week for the calendar
  const weekDays = [
    { letter: "M", day: 1, date: 14 },
    { letter: "T", day: 2, date: 15 },
    { letter: "W", day: 3, date: 16 },
    { letter: "T", day: 4, date: 17 },
    { letter: "F", day: 5, date: 18 },
    { letter: "S", day: 6, date: 19 },
    { letter: "S", day: 0, date: 20 }
  ];
  
  // Calculate remaining macros
  const remaining = {
    calories: nutritionPlan ? nutritionPlan.calories - consumed.calories : 0,
    carbs: nutritionPlan ? nutritionPlan.carbs - consumed.carbs : 0,
    protein: nutritionPlan ? nutritionPlan.protein - consumed.protein : 0,
    fats: nutritionPlan ? nutritionPlan.fats - consumed.fats : 0
  };
  
  // Load nutrition plan from localStorage
  useEffect(() => {
    const planData = localStorage.getItem("userNutritionPlan");
    if (planData) {
      setNutritionPlan(JSON.parse(planData));
    }
    
    // Mock data for consumed and recent items
    setConsumed({ calories: 724, carbs: 50, protein: 75, fats: 25 });
    setRecentItems([
      { 
        id: "1", 
        name: "Grocery Basket", 
        calories: 450, 
        timestamp: "11:30",
        imageUrl: "/lovable-uploads/3ea8dc86-3df2-4f4d-8d14-db82db158c9b.png" 
      }
    ]);
  }, []);
  
  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
  };
  
  const handleOpenCamera = () => {
    setShowCamera(true);
  };
  
  const handleCloseCamera = () => {
    setShowCamera(false);
  };
  
  const handleTakePhoto = () => {
    alert("Photo taken! This would process the image for food recognition in a real app.");
    setShowCamera(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white p-4 shadow-sm flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-bold text-xl">Cal AI</span>
        </div>
        
        {/* Week Calendar */}
        <div className="flex space-x-2 overflow-x-auto mx-2">
          {weekDays.map((day) => (
            <div 
              key={day.letter}
              onClick={() => handleDaySelect(day.day)}
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
      
      <div className="flex-1 px-4 py-2 max-w-md mx-auto w-full">
        {/* Calorie Summary Card */}
        <Card className="w-full shadow-sm rounded-xl mb-4 overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold">724</h1>
              <p className="text-gray-600">Calories over</p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f3f3" strokeWidth="2"></circle>
                <circle cx="18" cy="18" r="16" fill="none" stroke="#000" strokeWidth="2" strokeDasharray="100 100" strokeDashoffset="25"></circle>
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
                <span className="font-bold">102g</span>
                <span className="text-sm font-semibold"> Protein left</span>
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
                      strokeDashoffset="25"
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
                <span className="font-bold">136g</span>
                <span className="text-sm font-semibold"> Carbs left</span>
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
                      strokeDashoffset="40"
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
                <span className="font-bold">35g</span>
                <span className="text-sm font-semibold"> Fat left</span>
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
                      strokeDashoffset="65"
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
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm">{item.calories} kcal</span>
                      <span className="text-xs text-gray-500">{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-3">
        <Button variant="ghost" className="flex flex-col items-center p-1">
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center p-1">
          <LineChart className="h-5 w-5" />
          <span className="text-xs mt-1">Progress</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center p-1">
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Settings</span>
        </Button>
      </div>
      
      {/* Floating Action Button */}
      <Button
        onClick={handleOpenCamera}
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center shadow-lg"
      >
        <Camera className="h-6 w-6 text-white" />
      </Button>
      
      {/* Camera View Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex-1 relative">
            {/* This would be a real camera feed in a production app */}
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <p className="text-white">Camera Feed Would Show Here</p>
            </div>
          </div>
          <div className="p-4 bg-black flex justify-between">
            <Button variant="outline" onClick={handleCloseCamera} className="text-white border-white">
              Cancel
            </Button>
            <Button 
              onClick={handleTakePhoto}
              className="w-16 h-16 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center"
            >
              <div className="w-14 h-14 rounded-full border-4 border-black"></div>
            </Button>
            <div className="w-20"></div> {/* Placeholder for layout balance */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
