
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const OnboardingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-6">
      <div className="w-full flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          ←
        </Button>
        <div className="flex-1"></div>
      </div>
      
      <div className="flex flex-col items-center justify-center gap-6 w-full">
        <h1 className="text-2xl font-bold rubik">Coming Soon</h1>
        <p className="text-gray-600 text-center">
          This is where the onboarding process will continue.
        </p>
      </div>
    </div>
  );
};

export default OnboardingPage;
