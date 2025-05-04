
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BirthdateForm = () => {
  const navigate = useNavigate();
  
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [year, setYear] = useState<string>("");
  
  // Load saved data from localStorage if available
  useEffect(() => {
    const savedMonth = localStorage.getItem("userBirthMonth");
    const savedDay = localStorage.getItem("userBirthDay");
    const savedYear = localStorage.getItem("userBirthYear");
    
    if (savedMonth) setMonth(savedMonth);
    if (savedDay) setDay(savedDay);
    if (savedYear) setYear(savedYear);
  }, []);
  
  // Generate arrays for months, days, and years
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i.toString());
    }
    return days;
  };
  
  const generateYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 100; i--) {
      years.push(i.toString());
    }
    return years;
  };
  
  const days = generateDays();
  const years = generateYears();
  
  const handleContinue = () => {
    // Save data to localStorage
    localStorage.setItem("userBirthMonth", month);
    localStorage.setItem("userBirthDay", day);
    localStorage.setItem("userBirthYear", year);
    
    // Navigate to next onboarding page
    navigate("/onboarding/step5");
  };
  
  // Check if all fields are filled to enable the continue button
  const isFormComplete = month && day && year;
  
  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/onboarding/gender")}
          className="p-0 h-auto"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex flex-col w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold rubik mb-2">
          When were you born?
        </h1>
        <p className="text-gray-500 mb-10">
          This will be used to calibrate your custom plan.
        </p>
        
        <div className="flex space-x-4 w-full">
          <div className="flex-1">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full h-14 text-lg">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {months.map((monthName, index) => (
                  <SelectItem key={monthName} value={(index + 1).toString()} className="text-base">
                    {monthName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="w-full h-14 text-lg">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {days.map(day => (
                  <SelectItem key={day} value={day} className="text-base">
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-full h-14 text-lg">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {years.map(year => (
                  <SelectItem key={year} value={year} className="text-base">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-auto pt-12">
          <Button 
            onClick={handleContinue}
            className="w-full py-6 text-lg font-medium rounded-xl bg-[#FACC15] text-black hover:bg-[#F59E0B]"
            disabled={!isFormComplete}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BirthdateForm;
