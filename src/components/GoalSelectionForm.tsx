
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type GoalOption = "lose weight" | "maintain" | "gain weight";

const GoalSelectionForm = () => {
  const navigate = useNavigate();
  
  const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(null);
  
  // Load saved data from localStorage if available
  useEffect(() => {
    const savedGoal = localStorage.getItem("userGoal");
    if (savedGoal && ["lose weight", "maintain", "gain weight"].includes(savedGoal)) {
      setSelectedGoal(savedGoal as GoalOption);
    }
  }, []);
  
  const handleGoalSelect = (goal: GoalOption) => {
    setSelectedGoal(goal);
  };
  
  const handleContinue = () => {
    // Save data to localStorage
    if (selectedGoal) {
      localStorage.setItem("userGoal", selectedGoal);
    }
    
    // Navigate to next onboarding page
    navigate("/onboarding/step5");
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/onboarding/step4")}
          className="p-0 h-auto"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex flex-col w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold rubik mb-2">
          What is your goal?
        </h1>
        <p className="text-gray-500 mb-10">
          This helps us generate a plan for your calorie intake.
        </p>
        
        <div className="space-y-4">
          {[
            { value: "lose weight", label: "Lose weight" },
            { value: "maintain", label: "Maintain" },
            { value: "gain weight", label: "Gain weight" }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleGoalSelect(option.value as GoalOption)}
              className={`w-full p-6 text-left rounded-xl transition-all ${
                selectedGoal === option.value
                  ? "border-2 border-black"
                  : "border border-gray-200"
              } bg-[#F1F1F1] hover:bg-gray-100`}
            >
              <div className="text-lg font-medium">{option.label}</div>
            </button>
          ))}
        </div>
        
        <div className="mt-auto pt-12">
          <Button 
            onClick={handleContinue}
            className="w-full py-6 text-lg font-medium rounded-xl bg-[#FACC15] text-black hover:bg-[#F59E0B]"
            disabled={!selectedGoal}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalSelectionForm;
