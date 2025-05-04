
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardView from "@/components/DashboardView";

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    
    // If not logged in, redirect to welcome page
    if (!isLoggedIn) {
      navigate("/");
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
    }
    
    // Initialize food logs if not set
    if (!localStorage.getItem("foodLogs")) {
      localStorage.setItem("foodLogs", JSON.stringify({}));
    }
  }, [navigate]);
  
  return <DashboardView />;
};

export default Dashboard;
