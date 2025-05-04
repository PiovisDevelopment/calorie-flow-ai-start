
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FrequencyOption = "0-2" | "3-5" | "6+";

const WorkoutFrequencyForm = () => {
  const navigate = useNavigate();
  
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyOption | null>(null);
  
  // Load saved data from localStorage if available
  useEffect(() => {
    const savedFrequency = localStorage.getItem("workoutFrequency");
    if (savedFrequency && ["0-2", "3-5", "6+"].includes(savedFrequency)) {
      setSelectedFrequency(savedFrequency as FrequencyOption);
    }
  }, []);
  
  const handleFrequencySelect = (frequency: FrequencyOption) => {
    setSelectedFrequency(frequency);
  };
  
  const handleContinue = () => {
    // Save data to localStorage
    if (selectedFrequency) {
      localStorage.setItem("workoutFrequency", selectedFrequency);
    }
    
    // Navigate to next page (will be implemented in future)
    console.log("Continue to next page");
    // For now this would just redirect to home, we'll update the route later
    navigate("/");
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/onboarding/step3")}
          className="p-0 h-auto"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex flex-col w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold rubik mb-2">
          How many workouts do you do per week?
        </h1>
        <p className="text-gray-500 mb-10">
          This will be used to calibrate your custom plan.
        </p>
        
        <div className="space-y-4">
          {[
            { value: "0-2", label: "Workouts now and then" },
            { value: "3-5", label: "A few workouts per week" },
            { value: "6+", label: "Dedicated athlete" }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleFrequencySelect(option.value as FrequencyOption)}
              className={`w-full p-6 text-left rounded-xl transition-all ${
                selectedFrequency === option.value
                  ? "border-2 border-black"
                  : "border border-gray-200"
              } bg-[#F1F1F1] hover:bg-gray-100`}
            >
              <div className="text-lg font-medium">{option.value}</div>
              <div className="text-gray-500">{option.label}</div>
            </button>
          ))}
        </div>
        
        <div className="mt-auto pt-12">
          <Button 
            onClick={handleContinue}
            className="w-full py-6 text-lg font-medium rounded-xl bg-[#FACC15] text-black hover:bg-[#F59E0B]"
            disabled={!selectedFrequency}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutFrequencyForm;
