
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HeightWeightForm = () => {
  const navigate = useNavigate();
  
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  
  // Load saved data from localStorage if available
  useEffect(() => {
    const savedHeight = localStorage.getItem("userHeight");
    const savedWeight = localStorage.getItem("userWeight");
    
    if (savedHeight) setHeight(savedHeight);
    if (savedWeight) setWeight(savedWeight);
  }, []);
  
  const handleContinue = () => {
    // Save data to localStorage
    if (height) localStorage.setItem("userHeight", height);
    if (weight) localStorage.setItem("userWeight", weight);
    
    // Navigate to next page
    navigate("/onboarding/step4");
  };
  
  // Generate height options from 140cm to 220cm
  const heightOptions = Array.from({ length: 81 }, (_, i) => `${140 + i} cm`);
  
  // Generate weight options from 40kg to 150kg
  const weightOptions = Array.from({ length: 111 }, (_, i) => `${40 + i} kg`);
  
  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/onboarding")}
          className="p-0 h-auto"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex flex-col w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold rubik mb-2">
          Height & weight
        </h1>
        <p className="text-gray-500 mb-10">
          This will be used to calibrate your custom plan.
        </p>
        
        <div className="space-y-8">
          <div className="flex flex-col space-y-2">
            <label htmlFor="height" className="font-medium text-gray-700">
              Height
            </label>
            <Select value={height} onValueChange={setHeight}>
              <SelectTrigger className="h-14 text-base">
                <SelectValue placeholder="Select height" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {heightOptions.map((h) => (
                  <SelectItem key={h} value={h} className="py-2.5">
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="weight" className="font-medium text-gray-700">
              Weight
            </label>
            <Select value={weight} onValueChange={setWeight}>
              <SelectTrigger className="h-14 text-base">
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {weightOptions.map((w) => (
                  <SelectItem key={w} value={w} className="py-2.5">
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-auto pt-12">
          <Button 
            onClick={handleContinue}
            className="w-full py-6 text-lg font-medium rounded-xl bg-[#FACC15] text-black hover:bg-[#F59E0B]"
            disabled={!height || !weight}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeightWeightForm;
