
// Function to calculate age from birthdate
export function calculateAge(birthYear: string, birthMonth: string, birthDay: string): number {
  const today = new Date();
  const birthdate = new Date(Number(birthYear), Number(birthMonth) - 1, Number(birthDay));
  
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  
  return age;
}

// Function to calculate target date (1 week from now)
export function calculateTargetDate(): string {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);
  
  const month = targetDate.toLocaleString('default', { month: 'long' });
  const day = targetDate.getDate();
  
  return `${month} ${day}`;
}

// Function to convert height from cm to cm (already in cm)
export function convertHeight(heightStr: string): number {
  // Extract numeric part from "XXX cm"
  return parseInt(heightStr.split(' ')[0]);
}

// Function to convert weight from kg to kg (already in kg)
export function convertWeight(weightStr: string): number {
  // Extract numeric part from "XXX kg"
  return parseInt(weightStr.split(' ')[0]);
}

// Main function to calculate nutrition plan
export function calculateNutritionPlan() {
  // Get user data from localStorage
  const heightStr = localStorage.getItem("userHeight") || "170 cm";
  const weightStr = localStorage.getItem("userWeight") || "70 kg";
  const gender = localStorage.getItem("userGender") || "male";
  const birthYear = localStorage.getItem("userBirthYear") || "1990";
  const birthMonth = localStorage.getItem("userBirthMonth") || "1";
  const birthDay = localStorage.getItem("userBirthDay") || "1";
  const activityLevel = localStorage.getItem("workoutFrequency") || "3-5";
  const goal = localStorage.getItem("userGoal") || "maintain";
  
  // Convert units
  const height_cm = convertHeight(heightStr);
  const weight_kg = convertWeight(weightStr);
  const weight_lbs = weight_kg * 2.205; // Convert kg to lbs for macros calculation
  const age = calculateAge(birthYear, birthMonth, birthDay);
  
  console.log("User Data:", {
    height: height_cm,
    weight_kg,
    weight_lbs,
    gender,
    age,
    activityLevel,
    goal
  });
  
  // Calculate BMR using Mifflin-St Jeor Formula
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  }
  
  console.log("BMR:", bmr);
  
  // Apply activity factor to get TDEE
  let activityFactor = 1.2; // Default
  if (activityLevel === "3-5") {
    activityFactor = 1.375;
  } else if (activityLevel === "6+") {
    activityFactor = 1.55;
  }
  
  let tdee = bmr * activityFactor;
  console.log("TDEE (before goal adjustment):", tdee);
  
  // Apply goal adjustment
  let adjustedTDEE = tdee;
  let weightChangePerWeek = 0;
  
  if (goal === "lose weight") {
    adjustedTDEE = tdee * 0.8;
    // Calculate approximate weight loss per week (3500 kcal deficit = 1 lb loss)
    const dailyDeficit = tdee - adjustedTDEE;
    weightChangePerWeek = (dailyDeficit * 7) / 3500;
  } else if (goal === "gain weight") {
    adjustedTDEE = tdee * 1.15;
    // Calculate approximate weight gain per week (3500 kcal surplus = 1 lb gain)
    const dailySurplus = adjustedTDEE - tdee;
    weightChangePerWeek = (dailySurplus * 7) / 3500;
  }
  
  console.log("Adjusted TDEE:", adjustedTDEE);
  console.log("Projected weight change per week (lbs):", weightChangePerWeek);
  
  // Calculate macronutrients
  const protein_g = Math.round(weight_lbs * 1.0);
  const protein_cal = protein_g * 4;
  
  const fat_g = Math.round(weight_lbs * 0.4);
  const fat_cal = fat_g * 9;
  
  const carbs_cal = adjustedTDEE - (protein_cal + fat_cal);
  const carbs_g = Math.round(carbs_cal / 4);
  
  console.log("Macros (g):", {
    protein: protein_g,
    fat: fat_g,
    carbs: carbs_g
  });
  
  console.log("Macros (cal):", {
    protein: protein_cal,
    fat: fat_cal,
    carbs: carbs_cal
  });
  
  // Final plan to return
  return {
    calories: Math.round(adjustedTDEE),
    carbs: carbs_g,
    protein: protein_g,
    fats: fat_g,
    weightChange: Math.abs(Math.round(weightChangePerWeek * 10) / 10), // Round to 1 decimal place
    goalType: goal,
    targetDate: calculateTargetDate()
  };
}
