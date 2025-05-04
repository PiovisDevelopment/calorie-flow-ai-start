
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { ChevronLeft } from "lucide-react";

const data = [
  { month: "Month 1", calAI: 100, traditional: 100 },
  { month: "Month 2", calAI: 70, traditional: 85 },
  { month: "Month 3", calAI: 60, traditional: 70 },
  { month: "Month 4", calAI: 50, traditional: 75 },
  { month: "Month 5", calAI: 45, traditional: 90 },
  { month: "Month 6", calAI: 45, traditional: 95 },
];

const config = {
  calAI: {
    label: "Cal AI",
    theme: {
      light: "#000000",
      dark: "#000000",
    },
  },
  traditional: {
    label: "Traditional diet",
    theme: {
      light: "#FF6B6B",
      dark: "#FF6B6B",
    },
  },
};

const ValueProposition = () => {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    navigate("/onboarding/step3");
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="p-0 h-auto"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex flex-col w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold rubik mb-8">
          Cal AI creates<br/>long-term results
        </h1>
        
        <div className="w-full bg-gray-50 p-4 rounded-xl mb-8">
          <div className="mb-4 text-gray-700 font-medium">Your weight</div>
          <div className="h-60 w-full">
            <ChartContainer
              config={config}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorCalAI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#000000" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorTraditional" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis 
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    ticks={["Month 2", "Month 3", "Month 4", "Month 6"]}
                  />
                  <YAxis hide={true} />
                  <Area
                    type="monotone"
                    dataKey="calAI"
                    stroke="#000000"
                    strokeWidth={2}
                    fill="url(#colorCalAI)"
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="traditional"
                    stroke="#FF6B6B"
                    strokeWidth={2}
                    fill="url(#colorTraditional)"
                    dot={{ r: 4, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="flex items-center gap-2 mt-4 justify-center">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span className="text-sm">Cal AI</span>
              </div>
              <div className="flex items-center gap-1 ml-6">
                <div className="w-2 h-2 bg-[#FF6B6B] rounded-full"></div>
                <span className="text-sm text-gray-700">Traditional diet</span>
              </div>
            </div>
          </div>
          
          <p className="text-center text-gray-600 mt-4">
            80% of Cal AI users maintain their weight loss even 6 months later
          </p>
        </div>
        
        <div className="mt-auto">
          <Button 
            onClick={handleContinue}
            className="w-full py-6 text-lg font-medium rounded-xl bg-[#FACC15] text-black hover:bg-[#F59E0B]"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValueProposition;
