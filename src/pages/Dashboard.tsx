
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
  }, [navigate]);
  
  return <DashboardView />;
};

export default Dashboard;
