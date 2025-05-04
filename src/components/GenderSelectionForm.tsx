
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type GenderOption = "male" | "female" | "other";

const GenderSelectionForm = () => {
  const navigate = useNavigate();
  
  const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null);
  
  // Load saved data from localStorage if available
  useEffect(() => {
    const savedGender = localStorage.getItem("userGender");
    if (savedGender && ["male", "female", "other"].includes(savedGender)) {
      setSelectedGender(savedGender as GenderOption);
    }
  }, []);
  
  const handleGenderSelect = (gender: GenderOption) => {
    setSelectedGender(gender);
  };
  
  const handleContinue = () => {
    // Save data to localStorage
    if (selectedGender) {
      localStorage.setItem("userGender", selectedGender);
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
          onClick={() => navigate("/onboarding/goal")}
          className="p-0 h-auto"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex flex-col w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold rubik mb-2">
          Choose your Gender
        </h1>
        <p className="text-gray-500 mb-10">
          This will be used to calibrate your custom plan.
        </p>
        
        <div className="space-y-4">
          {[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleGenderSelect(option.value as GenderOption)}
              className={`w-full p-6 text-center rounded-xl transition-all ${
                selectedGender === option.value
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
            disabled={!selectedGender}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenderSelectionForm;
