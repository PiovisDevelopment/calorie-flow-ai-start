
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
  const age = calculateAge(birthYear, birthMonth, birthDay);
  
  // Define target weight loss (for calculation purposes)
  const target_weight_loss_kg = 0.5; // Default target of 0.5kg per week for weight loss
  
  const userData = {
    height: height_cm,
    weight_kg,
    gender,
    age,
    activityLevel,
    goal
  };
  
  console.log("User Data:", userData);
  
  // Calculate BMR using updated formula
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight_kg + 6.2 * height_cm - 5 * age + 5;
  } else {
    bmr = 10 * weight_kg + 6.2 * height_cm - 5 * age - 161;
  }
  
  console.log("BMR:", bmr);
  
  // Apply activity factor
  let activityFactor = 1.2; // Default for 0-2 workouts
  if (activityLevel === "3-5") {
    activityFactor = 1.375;
  } else if (activityLevel === "6+") {
    activityFactor = 1.55;
  }
  
  let tdee = bmr * activityFactor;
  console.log("TDEE:", tdee);
  
  // Apply goal adjustment
  let targetCalories = tdee;
  let weightChangePerWeek = 0;
  
  if (goal === "lose weight") {
    // Calculate deficit based on target weight loss
    const dailyDeficit = (target_weight_loss_kg * 7700) / 7; // 7700 calories per kg, divided by 7 days
    targetCalories = tdee - dailyDeficit;
    weightChangePerWeek = target_weight_loss_kg;
  } else if (goal === "gain weight") {
    targetCalories = tdee * 1.15;
    // Calculate approximate weight gain per week
    const dailySurplus = targetCalories - tdee;
    weightChangePerWeek = (dailySurplus * 7) / 7700; // 7700 calories per kg
  }
  
  console.log("Target Calories:", targetCalories);
  console.log("Projected weight change per week (kg):", weightChangePerWeek);
  
  // Calculate macronutrients based on kg
  const protein_g = Math.round(2.2 * weight_kg);
  const protein_cal = protein_g * 4;
  
  const fat_g = Math.round(0.88 * weight_kg);
  const fat_cal = fat_g * 9;
  
  const carbs_cal = targetCalories - (protein_cal + fat_cal);
  const carbs_g = Math.max(0, Math.round(carbs_cal / 4)); // Ensure not negative
  
  const macros = {
    proteinG: protein_g,
    fatG: fat_g,
    carbsG: carbs_g,
    proteinCal: protein_cal,
    fatCal: fat_cal,
    carbsCal: carbs_cal
  };
  
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
  
  // Convert weight change to lbs for display (if needed)
  const weightChangeLbs = weightChangePerWeek * 2.205;
  
  // Collect debug logs
  const debugLogs = {
    userData,
    bmr,
    tdee,
    targetCalories,
    weightChangePerWeek,
    macros
  };
  
  // Final plan to return
  return {
    calories: Math.round(targetCalories),
    carbs: carbs_g,
    protein: protein_g,
    fats: fat_g,
    weightChange: Math.abs(Math.round(weightChangeLbs * 10) / 10), // Round to 1 decimal place
    goalType: goal,
    targetDate: calculateTargetDate(),
    debugLogs // Include debug logs in the returned object
  };
}

