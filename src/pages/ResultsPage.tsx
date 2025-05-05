
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface ResultData {
  description: string;
  health_suggestion: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  image?: string;
}

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<ResultData | null>(null);
  
  useEffect(() => {
    if (location.state?.result) {
      setResult(location.state.result);
    } else {
      navigate("/dashboard");
    }
  }, [location.state, navigate]);
  
  const handleSave = () => {
    if (result) {
      // Get current logs or initialize empty array
      const existingLogs = JSON.parse(localStorage.getItem("foodLogs") || "{}");
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const dateKey = today.toISOString().split('T')[0];
      
      // Initialize today's logs if they don't exist
      if (!existingLogs[dateKey]) {
        existingLogs[dateKey] = [];
      }
      
      // Add new log
      const newLog = {
        id: Date.now().toString(),
        name: "Food Item",
        calories: result.calories,
        carbs: result.carbs,
        protein: result.protein,
        fats: result.fats,
        description: result.description,
        health_suggestion: result.health_suggestion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        imageUrl: result.image
      };
      
      existingLogs[dateKey].unshift(newLog);
      
      // Save to localStorage
      localStorage.setItem("foodLogs", JSON.stringify(existingLogs));
      
      toast.success("Food item saved to your log");
      navigate("/dashboard");
    }
  };
  
  const handleBack = () => {
    navigate("/dashboard");
  };
  
  if (!result) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="max-w-md mx-auto w-full flex-1 p-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={handleBack} className="p-1">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Food Analysis Results</h1>
        </div>
        
        {result.image && (
          <div className="mb-4">
            <img 
              src={result.image} 
              alt="Food item" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        
        <Card className="p-4 mb-4">
          <h2 className="font-bold text-lg mb-2">Description</h2>
          <p className="text-gray-700 mb-4">{result.description}</p>
          
          <h2 className="font-bold text-lg mb-2">Health Suggestion</h2>
          <p className="text-gray-700 mb-4">{result.health_suggestion}</p>
        </Card>
        
        <Card className="p-4 mb-6">
          <h2 className="font-bold text-lg mb-2">Nutritional Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Calories</p>
              <p className="font-bold text-lg">{result.calories} kcal</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carbs</p>
              <p className="font-bold text-lg">{result.carbs}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Protein</p>
              <p className="font-bold text-lg">{result.protein}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fats</p>
              <p className="font-bold text-lg">{result.fats}g</p>
            </div>
          </div>
        </Card>
        
        <Button onClick={handleSave} className="w-full bg-black text-white">
          Save to My Log
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
