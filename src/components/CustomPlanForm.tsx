
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check, Flame, Wheat, Drumstick, Droplet, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { calculateNutritionPlan } from "@/utils/nutritionCalculations";

interface NutritionPlan {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  weightChange: number;
  goalType: string;
  targetDate: string;
}

const CustomPlanForm = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<NutritionPlan | null>(null);
  
  useEffect(() => {
    // Calculate nutrition plan when component mounts
    const calculatedPlan = calculateNutritionPlan();
    setPlan(calculatedPlan);
  }, []);
  
  // Render loading state if plan is not calculated yet
  if (!plan) {
    return (
      <div className="flex flex-col min-h-screen bg-white p-6 items-center justify-center">
        <p>Calculating your custom plan...</p>
      </div>
    );
  }
  
  const getWeightChangeText = () => {
    if (plan.goalType === "maintain") {
      return "You should maintain your weight";
    } else if (plan.goalType === "lose weight") {
      return `You should lose: ${plan.weightChange} lbs by ${plan.targetDate}`;
    } else {
      return `You should gain: ${plan.weightChange} lbs by ${plan.targetDate}`;
    }
  };
  
  const handleGetStarted = () => {
    // Save plan to localStorage for future reference
    localStorage.setItem("userNutritionPlan", JSON.stringify(plan));
    
    // For now, just alert that we're done (this would navigate to dashboard in a real app)
    alert("Custom plan created! This would navigate to the main dashboard.");
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/onboarding/birthdate")}
          className="p-0 h-auto"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        <div className="flex justify-center items-center w-12 h-12 rounded-full bg-black mb-4">
          <Check className="h-8 w-8 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">
          Congratulations<br />your custom plan is ready!
        </h1>
        
        <p className="text-gray-700 mb-8 text-center">
          {getWeightChangeText()}
        </p>
        
        <div className="w-full bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-medium mb-1">Daily recommendation</h2>
          <p className="text-sm text-gray-400 mb-6">You can edit this anytime</p>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Calories */}
            <div className="relative bg-white p-4 rounded-lg flex flex-col items-center">
              <div className="flex items-center mb-1">
                <Flame className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm font-medium">Calories</span>
              </div>
              <div className="relative w-16 h-16 my-2">
                <Progress className="absolute w-16 h-16 rounded-full" value={75} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{plan.calories}</span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2">
                <Pencil className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {/* Carbs */}
            <div className="relative bg-white p-4 rounded-lg flex flex-col items-center">
              <div className="flex items-center mb-1">
                <Wheat className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium">Carbs</span>
              </div>
              <div className="relative w-16 h-16 my-2">
                <Progress className="absolute w-16 h-16 rounded-full bg-orange-100" 
                  value={75}
                  style={{
                    "--tw-bg-opacity": 0.2,
                    backgroundColor: "rgba(251, 146, 60, var(--tw-bg-opacity))",
                  } as any} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{plan.carbs}</span>
                  <span className="text-xs ml-0.5">g</span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2">
                <Pencil className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {/* Protein */}
            <div className="relative bg-white p-4 rounded-lg flex flex-col items-center">
              <div className="flex items-center mb-1">
                <Drumstick className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm font-medium">Protein</span>
              </div>
              <div className="relative w-16 h-16 my-2">
                <Progress className="absolute w-16 h-16 rounded-full bg-red-100" 
                  value={75}
                  style={{
                    "--tw-bg-opacity": 0.2,
                    backgroundColor: "rgba(239, 68, 68, var(--tw-bg-opacity))",
                  } as any} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{plan.protein}</span>
                  <span className="text-xs ml-0.5">g</span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2">
                <Pencil className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {/* Fats */}
            <div className="relative bg-white p-4 rounded-lg flex flex-col items-center">
              <div className="flex items-center mb-1">
                <Droplet className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium">Fats</span>
              </div>
              <div className="relative w-16 h-16 my-2">
                <Progress className="absolute w-16 h-16 rounded-full bg-blue-100" 
                  value={75}
                  style={{
                    "--tw-bg-opacity": 0.2,
                    backgroundColor: "rgba(59, 130, 246, var(--tw-bg-opacity))",
                  } as any} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{plan.fats}</span>
                  <span className="text-xs ml-0.5">g</span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2">
                <Pencil className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full mt-auto">
          <Button 
            onClick={handleGetStarted}
            className="w-full py-6 text-lg font-medium rounded-xl bg-black text-white hover:bg-gray-800"
          >
            Let's get started!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomPlanForm;
