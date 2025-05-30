
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeScreen from "@/components/WelcomeScreen";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    
    // If logged in, redirect to dashboard
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [navigate]);
  
  return <WelcomeScreen />;
};

export default Index;
