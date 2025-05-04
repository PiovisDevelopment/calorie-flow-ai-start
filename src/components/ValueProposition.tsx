
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

const data = [
  { month: "Month 1", calAI: 100, traditional: 100 },
  { month: "Month 2", calAI: 85, traditional: 75 },
  { month: "Month 3", calAI: 70, traditional: 65 },
  { month: "Month 4", calAI: 60, traditional: 70 },
  { month: "Month 5", calAI: 55, traditional: 85 },
  { month: "Month 6", calAI: 50, traditional: 95 },
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
    <div className="flex flex-col items-center min-h-screen bg-white p-6">
      <div className="w-full flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-full"
        >
          ←
        </Button>
        <div className="flex-1"></div>
      </div>
      
      <div className="flex flex-col items-center w-full max-w-md">
        <h1 className="text-3xl font-bold rubik mb-8 text-left w-full">
          Cal AI creates<br/>long-term results
        </h1>
        
        <div className="w-full bg-gray-50 p-4 rounded-2xl mb-6">
          <div className="mb-2 text-gray-700 text-lg">Your weight</div>
          <div className="h-56 w-full">
            <ChartContainer
              config={config}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis 
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    ticks={["Month 1", "Month 6"]}
                  />
                  <YAxis hide={true} />
                  <Area
                    type="monotone"
                    dataKey="calAI"
                    stroke="#000000"
                    strokeWidth={2}
                    fill="url(#colorCalAI)"
                    activeDot={{ r: 8 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="traditional"
                    stroke="#FF6B6B"
                    strokeWidth={2}
                    fill="url(#colorTraditional)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="flex justify-between mt-2">
              <div className="text-sm">Month 1</div>
              <div className="text-sm">Month 6</div>
            </div>
            
            <div className="flex items-center justify-end gap-2 mt-2">
              <div className="text-sm text-gray-700">Traditional diet</div>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span className="text-sm">Cal AI</span>
              </div>
              <span className="text-xs bg-gray-800 text-white px-2 py-0.5 rounded-full">Weight</span>
            </div>
          </div>
          
          <p className="text-center text-gray-700 mt-2">
            80% of Cal AI users maintain their weight loss even 6 months later
          </p>
        </div>
        
        <div className="w-full mt-auto">
          <Button 
            onClick={handleContinue}
            className="w-full py-6 text-lg font-semibold rubik"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValueProposition;
