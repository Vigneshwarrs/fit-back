const mongoose = require('mongoose');
const Suggestion = require('../models/Suggestion'); // Adjust the path as needed

mongoose.connect('mongodb://localhost/tracker');

// Helper functions
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
    case 'weightLoss':
      proteinRatio = 0.4;
      carbRatio = 0.3;
      fatRatio = 0.3;
      break;
    case 'muscleGain':
      proteinRatio = 0.3;
      carbRatio = 0.5;
      fatRatio = 0.2;
      break;
    case 'maintenance':
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

// Food suggestions based on goal and macros
const foodSuggestions = [
  { content: "Grilled chicken breast with quinoa and steamed vegetables", calories: 400, type: "food", difficulty: "easy" },
  { content: "Salmon with sweet potato and asparagus", calories: 450, type: "food", difficulty: "medium" },
  { content: "Greek yogurt with berries and almonds", calories: 300, type: "food", difficulty: "easy" },
  { content: "Lentil soup with whole grain bread", calories: 350, type: "food", difficulty: "easy" },
  { content: "Tofu stir-fry with brown rice", calories: 400, type: "food", difficulty: "medium" },
  { content: "Egg white omelette with spinach and feta cheese", calories: 250, type: "food", difficulty: "easy" },
  { content: "Tuna salad with mixed greens and avocado", calories: 350, type: "food", difficulty: "easy" },
  { content: "Turkey and hummus wrap with carrot sticks", calories: 400, type: "food", difficulty: "easy" },
  { content: "Protein smoothie with banana and peanut butter", calories: 300, type: "food", difficulty: "easy" },
  { content: "Grilled lean steak with roasted Brussels sprouts", calories: 500, type: "food", difficulty: "medium" }
];

// Workout suggestions based on fitness level
const workoutSuggestions = [
  { content: "30-minute brisk walk", calories: 150, type: "workout", difficulty: "easy" },
  { content: "20-minute HIIT workout", calories: 200, type: "workout", difficulty: "hard" },
  { content: "45-minute yoga session", calories: 180, type: "workout", difficulty: "medium" },
  { content: "30-minute swimming", calories: 220, type: "workout", difficulty: "medium" },
  { content: "1-hour weight training session", calories: 300, type: "workout", difficulty: "hard" },
  { content: "30-minute cycling", calories: 250, type: "workout", difficulty: "medium" },
  { content: "20-minute bodyweight circuit", calories: 150, type: "workout", difficulty: "easy" },
  { content: "45-minute Pilates class", calories: 170, type: "workout", difficulty: "medium" },
  { content: "1-hour basketball game", calories: 350, type: "workout", difficulty: "hard" },
  { content: "30-minute elliptical workout", calories: 200, type: "workout", difficulty: "easy" }
];

// Function to generate personalized suggestions
const generatePersonalizedSuggestions = (user) => {
  const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
  const tdee = calculateTDEE(bmr, user.activityLevel);
  let targetCalories;

  switch(user.goal) {
    case 'weightLoss':
      targetCalories = tdee - 500; // 500 calorie deficit for weight loss
      break;
    case 'muscleGain':
      targetCalories = tdee + 300; // 300 calorie surplus for muscle gain
      break;
    case 'maintenance':
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

  return {
    targetCalories,
    macros,
    bmi,
    dietSuggestion
  };
};

// Sample user data
const sampleUsers = [
  { name: "John", weight: 80, height: 180, age: 30, gender: 'male', activityLevel: 'moderatelyActive', goal: 'weightLoss' },
  { name: "Emma", weight: 65, height: 165, age: 28, gender: 'female', activityLevel: 'lightlyActive', goal: 'muscleGain' },
  { name: "Michael", weight: 90, height: 175, age: 35, gender: 'male', activityLevel: 'veryActive', goal: 'maintenance' }
];

// Populate database
async function populateDatabase() {
  try {
    // Clear existing data
    await Suggestion.deleteMany({});

    // Add food suggestions
    await Suggestion.insertMany(foodSuggestions);

    // Add workout suggestions
    await Suggestion.insertMany(workoutSuggestions);

    // Generate and log personalized suggestions for sample users
    for (const user of sampleUsers) {
      const personalizedSuggestions = generatePersonalizedSuggestions(user);
      console.log(`Personalized suggestions for ${user.name}:`);
      console.log(JSON.stringify(personalizedSuggestions, null, 2));
      console.log('\n');
    }

    console.log('Database populated successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    mongoose.disconnect();
  }
}

populateDatabase();