
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardView from "@/components/DashboardView";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    
    // If not logged in, redirect to welcome page
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
    
    // Initialize nutrition plan if not set
    const planData = localStorage.getItem("userNutritionPlan");
    if (!planData) {
      const defaultPlan = {
        calories: 2000,
        carbs: 225,
        protein: 150,
        fats: 65
      };
      localStorage.setItem("userNutritionPlan", JSON.stringify(defaultPlan));
      console.log("Initialized default nutrition plan");
    }
    
    // Initialize food logs if not set
    if (!localStorage.getItem("foodLogs")) {
      localStorage.setItem("foodLogs", JSON.stringify({}));
      console.log("Initialized empty food logs");
    }
    
    // Check network connectivity
    fetch('https://www.google.com', { mode: 'no-cors' })
      .then(() => console.log("Network connectivity confirmed"))
      .catch(() => {
        console.error("Network connectivity issues detected");
        toast.error("Network connectivity issues detected", {
          description: "You may experience issues with some features due to network connectivity problems."
        });
      });
      
  }, [navigate]);
  
  return <DashboardView />;
};

export default Dashboard;
