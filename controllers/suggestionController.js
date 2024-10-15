const Suggestion = require('../models/Suggestion');
const mapActivityLevelToDifficulty = (activityLevel) => {
  switch (activityLevel) {
    case 'sedentary':
    case 'lightlyActive':
      return 'easy';
    case 'moderatelyActive':
      return 'medium';
    case 'veryActive':
    case 'extraActive':
      return 'high';
    default:
      return 'medium';
  }
};
const calculateBMI = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

const calculateTDEE = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedentary: 1.2,
    lightlyActive: 1.375,
    moderatelyActive: 1.55,
    veryActive: 1.725,
    extraActive: 1.9
  };
  return bmr * activityMultipliers[activityLevel];
};

const calculateMacros = (calories, goal) => {
  let proteinRatio, carbRatio, fatRatio;
  
  switch(goal) {
    case 'weight-loss':
      proteinRatio = 0.4;
      carbRatio = 0.3;
      fatRatio = 0.3;
      break;
    case 'muscle-gain':
      proteinRatio = 0.3;
      carbRatio = 0.5;
      fatRatio = 0.2;
      break;
    case 'general-fitness':
    default:
      proteinRatio = 0.3;
      carbRatio = 0.4;
      fatRatio = 0.3;
  }

  return {
    protein: Math.round((calories * proteinRatio) / 4), // 4 calories per gram of protein
    carbs: Math.round((calories * carbRatio) / 4), // 4 calories per gram of carbs
    fat: Math.round((calories * fatRatio) / 9) // 9 calories per gram of fat
  };
};

const generatePersonalizedSuggestions = (user) => {
  console.log(user);
  const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
  const tdee = calculateTDEE(bmr, user.activityLevel);
  let targetCalories;

  switch(user.goal) {
    case 'weight-loss':
      targetCalories = tdee - 500; // 500 calorie deficit for weight loss
      break;
    case 'muscle-gain':
      targetCalories = tdee + 300; // 300 calorie surplus for muscle gain
      break;
    case 'general-fitness':
    default:
      targetCalories = tdee;
  }

  const macros = calculateMacros(targetCalories, user.goal);
  const bmi = calculateBMI(user.weight, user.height);

  let dietSuggestion;
  if (bmi < 18.5) {
    dietSuggestion = "Focus on nutrient-dense foods to gain healthy weight. Increase your calorie intake with wholesome foods like nuts, avocados, and whole grains.";
  } else if (bmi >= 18.5 && bmi < 25) {
    dietSuggestion = "Maintain a balanced diet with a variety of fruits, vegetables, lean proteins, and whole grains.";
  } else if (bmi >= 25 && bmi < 30) {
    dietSuggestion = "Focus on portion control and increasing your intake of vegetables and lean proteins. Limit processed foods and sugary drinks.";
  } else {
    dietSuggestion = "Prioritize whole, unprocessed foods. Increase your vegetable intake, choose lean proteins, and limit high-calorie foods. Consider consulting a dietitian for personalized advice.";
  }

  const difficulty = mapActivityLevelToDifficulty(user.activityLevel);

  return {
    targetCalories,
    macros,
    bmi,
    dietSuggestion,
    difficulty
  };
};

exports.getSuggestions = async (req, res) => {
  try {
    // Assume user data is available in req.user after authentication
    const user = req.user;
    const personalizedSuggestions = generatePersonalizedSuggestions(user);

    // Fetch food and workout suggestions as before
    const foodSuggestions = await Suggestion.aggregate([
      { $match: { type: 'food' } },
      { $sample: { size: 3 } }
    ]);

    const workoutSuggestions = await Suggestion.aggregate([
      { $match: { 
        type: 'workout', 
        difficulty: personalizedSuggestions.difficulty 
      } },
      { $sample: { size: 2 } }
    ]);

    res.json({
      food: foodSuggestions,
      workout: workoutSuggestions,
      personalizedSuggestions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching suggestions', error: error.message });
  }
};







// const User = require('../models/User');
// const FoodItem = require('../models/FoodItems')

// exports.suggestionsNutrition = async (req, res) => {
//   try {
//     // Fetch user profile from database (adjust based on your database)
//     const user = await User.findById(req.user._id).populate('goal').exec();
//     // console.log(user); 

//     // Logic for calculating suggested calorie intake and macronutrient breakdown
//     const { height, weight, age, gender, goal, activityLevel } = user;
//     console.log("user",goal.goalName)
    
//     const suggestedCalories = calculateCalories(weight, height, age, gender, goal, activityLevel);
//     const macroBreakdown = calculateMacros(suggestedCalories, goal);

//     // const mealPlan = generateMealPlan(suggestedCalories, macroBreakdown, dietPreference);

//     res.json({
//       calories: suggestedCalories,
//       protein: macroBreakdown.protein.toFixed(2),
//       carbs: macroBreakdown.carbs.toFixed(2),
//       fat: macroBreakdown.fat.toFixed(2),
//       // mealPlan
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//     console.log(err);
//   }
// };

// function calculateCalories(weight, height, age, gender, goal, activityLevel) {
//     // Harris-Benedict Formula for BMR
//     console.log(goal);
//     let BMR;
//     if (gender === 'male') {
//       BMR = 10 * weight + 6.25 * height - 5 * age + 5; // BMR for men
//     } else {
//       BMR = 10 * weight + 6.25 * height - 5 * age - 161; // BMR for women
//     }
  
//     // Activity level multiplier
//     const activityMultiplier = getActivityMultiplier(activityLevel);
  
//     // TDEE (Total Daily Energy Expenditure)
//     const TDEE = BMR * activityMultiplier;
  
//     // Adjust calories based on user goal
//     let adjustedCalories;
//     switch (goal.goalName) {
//       case 'weight-loss':
//         adjustedCalories = TDEE - 500; // 500 calorie deficit for weight loss
//         break;
//       case 'muscle-gain':
//         adjustedCalories = TDEE + 300; // 300 calorie surplus for muscle gain
//         break;
//       case 'general-fitness':
//         adjustedCalories = TDEE; // Maintain TDEE for general fitness
//         break;
//       default:
//         adjustedCalories = TDEE; // Default to maintenance if no specific goal
//     }
  
//     return adjustedCalories;
//   }
  
//   // Example function to get activity multiplier
//   function getActivityMultiplier(activityLevel) {
//     switch (activityLevel) {
//       case 'sedentary':
//         return 1.2; // Little or no exercise
//       case 'light':
//         return 1.375; // Light exercise/sports 1-3 days/week
//       case 'moderate':
//         return 1.55; // Moderate exercise/sports 3-5 days/week
//       case 'advanced':
//         return 1.9; // Very hard exercise/physical job & exercise
//       default:
//         return 1.2; // Default to sedentary if activity level is unknown
//     }
//   }
  
//   function calculateMacros(calories, goal) {
//     let proteinPercentage, carbsPercentage, fatPercentage;
  
//     // Adjust macronutrient percentages based on user goal
//     switch (goal) {
//       case 'weight-loss':
//         proteinPercentage = 0.35; // Higher protein for muscle preservation
//         carbsPercentage = 0.30;   // Reduced carbs for fat loss
//         fatPercentage = 0.35;     // Moderate fat
//         break;
//       case 'muscle-gain':
//         proteinPercentage = 0.30; // High protein for muscle gain
//         carbsPercentage = 0.45;   // Higher carbs for energy
//         fatPercentage = 0.25;     // Lower fat
//         break;
//       case 'general-fitness':
//         proteinPercentage = 0.30; // Balanced macros
//         carbsPercentage = 0.40;
//         fatPercentage = 0.30;
//         break;
//       default:
//         proteinPercentage = 0.30; // Default to general fitness ratios
//         carbsPercentage = 0.40;
//         fatPercentage = 0.30;
//         break;
//     }
  
//     return {
//       protein: (calories * proteinPercentage) / 4,  // Protein: 4 calories per gram
//       carbs: (calories * carbsPercentage) / 4,      // Carbs: 4 calories per gram
//       fat: (calories * fatPercentage) / 9,          // Fat: 9 calories per gram
//     };
//   }
  
// // function calculateMacros(calories, goal) {
// //   // Example: Adjust macronutrient percentages based on user goal
// //   return {
// //     protein: (calories * 0.3) / 4,  // 30% of calories as protein
// //     carbs: (calories * 0.4) / 4,    // 40% of calories as carbs
// //     fat: (calories * 0.3) / 9,      // 30% of calories as fat
// //   };
// // }

// // function getActivityMultiplier(level) {
// //   const multipliers = {
// //     sedentary: 1.2,
// //     light: 1.375,
// //     moderate: 1.55,
// //     active: 1.725,
// //   };
// //   return multipliers[level] || 1.2; // Default to sedentary if undefined
// // }

// function generateMealPlan(calories, macroBreakdown, dietPreference) {
//     // Example portion sizes for meals and snacks (percentage distribution)
//     const meals = [
//       { name: 'Breakfast', calories: 0.25 },  // 25% of total calories
//       { name: 'Lunch', calories: 0.35 },      // 35% of total calories
//       { name: 'Dinner', calories: 0.30 },     // 30% of total calories
//     ];
    
//     const snacks = [
//       { name: 'Snack 1', calories: 0.05 },    // 5% of total calories
//       { name: 'Snack 2', calories: 0.05 },    // 5% of total calories
//     ];
  
//     const totalMeals = [...meals, ...snacks];
  
//     // Sample meal and snack suggestions (can be expanded)
//     const foodOptions = {
//       veg: {
//         breakfast: ['Oats with fruits', 'Vegetable smoothie'],
//         lunch: ['Lentil salad', 'Grilled vegetables with quinoa'],
//         dinner: ['Tofu stir-fry', 'Vegetable curry with rice'],
//         snack: ['Fruit salad', 'Mixed nuts'],
//       },
//       'non-veg': {
//         breakfast: ['Scrambled eggs with veggies', 'Chicken sausage with toast'],
//         lunch: ['Grilled chicken salad', 'Turkey sandwich'],
//         dinner: ['Baked salmon with vegetables', 'Chicken curry with rice'],
//         snack: ['Greek yogurt', 'Boiled eggs'],
//       },
//     };
  
//     // Generate meal plan with portioned calories
//     return totalMeals.map((meal) => {
//       const suggestedFood =
//         foodOptions[dietPreference][meal.name.toLowerCase().replace(' ', '')] || [];
      
//       return {
//         meal: meal.name,
//         calories: (meal.calories * calories).toFixed(2),
//         protein: ((meal.calories * macroBreakdown.protein) / calories).toFixed(2),
//         carbs: ((meal.calories * macroBreakdown.carbs) / calories).toFixed(2),
//         fat: ((meal.calories * macroBreakdown.fat) / calories).toFixed(2),
//         suggestions: suggestedFood.length ? suggestedFood[Math.floor(Math.random() * suggestedFood.length)] : 'No suggestions available'
//       };
//     });
//   }

// exports.suggestionsWorkout = async (req, res) => {
//   try {
//     // Fetch user profile from the database
//     const user = await User.findById(req.user._id);

//     // Logic for workout suggestion based on user's fitness level
//     const { fitnessLevel, goal } = user;

//     const workout = getWorkoutSuggestion(fitnessLevel, goal);

//     res.json(workout);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//     console.log(err);
//   }
// };

// function getWorkoutSuggestion(fitnessLevel, goal) {
//   // Example logic: Adjust workout intensity and type based on user goal and level
//   const workouts = {
//     beginner: { type: 'Light Cardio', duration: 30, intensity: 'Low' },
//     moderate: { type: 'Cardio & Strength', duration: 45, intensity: 'Moderate' },
//     advanced: { type: 'HIIT & Strength', duration: 60, intensity: 'High' },
//   };

//   const workout = workouts[fitnessLevel] || workouts['beginner'];
  
//   // Adjust based on specific goals (e.g., muscle gain vs. fat loss)
//   if (goal === 'muscle-gain') {
//     workout.type = 'Strength Training';
//     workout.duration += 15;  // Increase duration for muscle-building goals
//   }

//   return workout;
// }