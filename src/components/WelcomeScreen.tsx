
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/onboarding");
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.clear();
    
    // Show toast notification
    toast.success("Logged out successfully");
    
    // Redirect to the first tutorial page
    navigate("/onboarding");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 relative">
      {/* Logout button in top right corner */}
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleLogout}
          className="rounded-full"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md">
        <div className="relative w-full aspect-square max-w-xs overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1592415486689-125cbbfcbee2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Delicious sandwich"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold rubik tracking-tight">
            Calorie tracking made easy
          </h1>
          <p className="text-gray-600 text-lg">
            Scan your food. Get your custom plan.
          </p>
        </div>
        
        <div className="w-full mt-6">
          <Button 
            onClick={handleGetStarted}
            className="w-full py-6 text-lg font-semibold rubik"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
