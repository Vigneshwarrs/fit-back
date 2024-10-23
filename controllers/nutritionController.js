const Nutrition = require('../models/Nutrition');
const FoodItem = require('../models/FoodItems');
const User = require('../models/User');
const {createFoodItemFromNutrition} = require('../controllers/foodItemController');
// Create a new nutrition entry
// exports.createNutrition = async (req, res) => {
//   try {
//     const { date, meals } = req.body;
//     let totalCalories = 0;
//     const processedMeals = [];

//     // Loop through meals for the day
//     for (const [mealType, foodItems] of Object.entries(meals)) {
//       const meal = { name: mealType, foodItems: [], totalCalories: 0, totalProtien:0, totalCarbs: 0, totalFat: 0 };

//       // Loop through each food item in the meal
//       for (const foodItem of foodItems) {
//         let existFoodItem = await FoodItem.findOne({ name: foodItem.name }) || null;

//         // Handle custom food item creation
//         if (!existFoodItem && foodItem.customFoodName) {
//           existFoodItem = await createFoodItemFromNutrition(foodItem);
//         } 
        
//         if (!existFoodItem) {
//           return res.status(400).json({ error: 'Invalid food item details' });
//         }

//         const foodCalories = existFoodItem.caloriesPerGram * foodItem.quantity;
//         const foodProtien = existFoodItem.proteinPerGram * foodItem.quantity;
//         const foodCarbs = existFoodItem.carbsPerGram * foodItem.quantity;
//         const foodFat = existFoodItem.fatPerGram * foodItem.quantity;

//         // Accumulate totals
//         meal.totalProtien += foodProtien;
//         meal.totalCarbs += foodCarbs;
//         meal.totalFat += foodFat;
//         totalCalories += foodCalories;
//         meal.totalCalories += foodCalories;

//         meal.foodItems.push({
//           foodId: existFoodItem._id,
//           quantity: foodItem.quantity,
//           calories: foodCalories,
//           protien: foodProtien,
//           carbs: foodCarbs,
//           fat: foodFat
//         });
//       }

//       processedMeals.push(meal);
//     }

//     // Handle the date
//     const entryDate = date ? new Date(date).toISOString() : new Date().toISOString();

//     // Find existing entry for the same user and the same date
//     let existingNutrition = await Nutrition.findOne({
//       user: req.user._id,
//       date: entryDate,
//     });

//     if (existingNutrition) {
//       // Update existing nutrition entry
//       for (const newMeal of processedMeals) {
//         const existingMealIndex = existingNutrition.meals.findIndex(meal => meal.name === newMeal.name);

//         if (existingMealIndex !== -1) {
//           // Update existing meal with new food items
//           existingNutrition.meals[existingMealIndex].foodItems.push(...newMeal.foodItems);
//           existingNutrition.meals[existingMealIndex].totalCalories += newMeal.totalCalories;
//         } else {
//           // Add new meal if it doesn't exist
//           existingNutrition.meals.push(newMeal);
//         }
//       }

//       // Update total calories
//       existingNutrition.totalCalories += totalCalories;
//       await existingNutrition.save();
//       return res.status(200).json(existingNutrition);
//     } else {
//       // Create a new nutrition entry
//       const newNutrition = new Nutrition({
//         user: req.user._id,
//         date: entryDate,
//         meals: processedMeals,
//         totalCalories,
//       });

//       await newNutrition.save();
//       await User.findByIdAndUpdate(req.user._id, {
//         $push: { nutrition: newNutrition._id },
//       });
//       return res.status(201).json(newNutrition);
//     }
//   } catch (error) {
//     console.error('Error in creating/updating nutrition entry:', error);
//     return res.status(500).json({ error: 'Failed to create or update daily nutrition entry' });
//   }
// };

// exports.createNutrition = async (req, res) => {
//   try {
//     const { date, meals } = req.body;
//     let totalCalories = 0;
//     let totalProtein = 0;  // Declare totalProtein
//     let totalCarbs = 0;    // Declare totalCarbs
//     let totalFat = 0;      // Declare totalFat
//     const processedMeals = [];

//     // Loop through meals for the day
//     for (const [mealType, foodItems] of Object.entries(meals)) {
//       const meal = { name: mealType, foodItems: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 };

//       // Loop through each food item in the meal
//       for (const foodItem of foodItems) {
//         let existFoodItem = await FoodItem.findOne({ name: foodItem.name }) || null;

//         // Handle custom food item creation
//         if (!existFoodItem && foodItem.customFoodName) {
//           // Ensure required fields for custom food
//           if (!foodItem.calories || !foodItem.protein || !foodItem.carbs || !foodItem.fat) {
//             return res.status(400).json({ error: 'Custom food item must include calories, protein, carbs, and fat.' });
//           }
//           existFoodItem = await createFoodItemFromNutrition(foodItem);
//         } 
        
//         if (!existFoodItem) {
//           return res.status(400).json({ error: 'Invalid food item details' });
//         }

//         // Calculate nutrition values
//         const foodCalories = existFoodItem.caloriesPerGram * foodItem.quantity;
//         const foodProtein = existFoodItem.proteinPerGram * foodItem.quantity;
//         const foodCarbs = existFoodItem.caloriesPerGram * foodItem.quantity;
//         const foodFat = existFoodItem.fatPerGram * foodItem.quantity;

//         // Accumulate totals
//         totalProtein += foodProtein;
//         totalCarbs += foodCarbs;
//         totalFat += foodFat;
//         meal.totalProtein += foodProtein;
//         meal.totalCarbs += foodCarbs;
//         meal.totalFat += foodFat;
//         totalCalories += foodCalories;
//         meal.totalCalories += foodCalories;

//         meal.foodItems.push({
//           foodId: existFoodItem._id,
//           quantity: foodItem.quantity,
//           calories: foodCalories,
//           protein: foodProtein,
//           carbs: foodCarbs,
//           fat: foodFat
//         });
//       }

//       processedMeals.push(meal);
//     }

//     // Handle the date
//     const entryDate = date ? new Date(date).toISOString() : new Date().toISOString();

//     // Find existing entry for the same user and the same date
//     let existingNutrition = await Nutrition.findOne({
//       user: req.user._id,
//       date: entryDate,
//     });

//     if (existingNutrition) {
//       // Update existing nutrition entry
//       for (const newMeal of processedMeals) {
//         const existingMealIndex = existingNutrition.meals.findIndex(meal => meal.name === newMeal.name);

//         if (existingMealIndex !== -1) {
//           // Update existing meal with new food items
//           existingNutrition.meals[existingMealIndex].foodItems.push(...newMeal.foodItems);
//           existingNutrition.meals[existingMealIndex].totalCalories += newMeal.totalCalories;
//           existingNutrition.meals[existingMealIndex].totalProtein += newMeal.totalProtein;
//           existingNutrition.meals[existingMealIndex].totalCarbs += newMeal.totalCarbs;
//           existingNutrition.meals[existingMealIndex].totalFat += newMeal.totalFat; 
//         } else {
//           // Add new meal if it doesn't exist
//           existingNutrition.meals.push(newMeal);
//         }
//       }

//       // Update total calories and nutrients
//       existingNutrition.totalCalories += totalCalories;
//       existingNutrition.totalProtein += totalProtein;  // Update totalProtein
//       existingNutrition.totalCarbs += totalCarbs;      // Update totalCarbs
//       existingNutrition.totalFat += totalFat;          // Update totalFat
//       await existingNutrition.save();
//       return res.status(200).json(existingNutrition);
//     } else {
//       // Create a new nutrition entry
//       const newNutrition = new Nutrition({
//         user: req.user._id,
//         date: entryDate,
//         meals: processedMeals,
//         totalCalories,
//         totalProtein,  // Use accumulated totals
//         totalCarbs,
//         totalFat
//       });

//       await newNutrition.save();
//       await User.findByIdAndUpdate(req.user._id, {
//         $push: { nutrition: newNutrition._id },
//       });
//       return res.status(201).json(newNutrition);
//     }
//   } catch (error) {
//     console.error('Error in creating/updating nutrition entry:', error);
//     return res.status(500).json({ error: 'Failed to create or update daily nutrition entry' });
//   }
// };
exports.createNutrition = async (req, res) => {
  try {
    const { date, meals } = req.body;
    const entryDate = date ? new Date(date) : new Date();
    entryDate.setHours(0, 0, 0, 0);  // Set time to midnight for consistent date comparison

    let nutritionEntry = await Nutrition.findOne({
      user: req.user._id,
      date: entryDate,
    });

    if (!nutritionEntry) {
      nutritionEntry = new Nutrition({
        user: req.user._id,
        date: entryDate,
        meals: []
      });
    }

    for (const [mealType, foodItems] of Object.entries(meals)) {
      const mealIndex = nutritionEntry.meals.findIndex(meal => meal.name === mealType);
      const meal = mealIndex !== -1 ? nutritionEntry.meals[mealIndex] : { name: mealType, foodItems: [] };

      for (const foodItem of foodItems) {
        const existFoodItem = await getFoodItem(foodItem);
        if (!existFoodItem) {
          return res.status(400).json({ error: 'Invalid food item details' });
        }

        const nutritionValues = calculateNutritionValues(existFoodItem, foodItem.quantity);
        meal.foodItems.push({
          foodId: existFoodItem._id,
          quantity: foodItem.quantity,
          ...nutritionValues
        });

        updateMealTotals(meal, nutritionValues);
      }

      if (mealIndex === -1) {
        nutritionEntry.meals.push(meal);
      }
    }

    updateEntryTotals(nutritionEntry);

    await nutritionEntry.save();

    if (!nutritionEntry.isNew) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { nutrition: nutritionEntry._id },
      });
    }

    return res.status(nutritionEntry.isNew ? 201 : 200).json(nutritionEntry);
  } catch (error) {
    console.error('Error in creating/updating nutrition entry:', error);
    return res.status(500).json({ error: 'Failed to create or update daily nutrition entry' });
  }
};

async function getFoodItem(foodItem) {
  let existFoodItem = await FoodItem.findOne({ name: foodItem.name });
  if (!existFoodItem && foodItem.customFoodName) {
    if (!foodItem.calories || !foodItem.protein || !foodItem.carbs || !foodItem.fat) {
      throw new Error('Custom food item must include calories, protein, carbs, and fat.');
    }
    existFoodItem = await createFoodItemFromNutrition(foodItem);
  }
  return existFoodItem;
}

function calculateNutritionValues(foodItem, quantity) {
  return {
    calories: foodItem.caloriesPerGram * quantity,
    protein: foodItem.proteinPerGram * quantity,
    carbs: foodItem.carbsPerGram * quantity,
    fat: foodItem.fatPerGram * quantity
  };
}

function updateMealTotals(meal, nutritionValues) {
  meal.totalCalories = (meal.totalCalories || 0) + nutritionValues.calories;
  meal.totalProtein = (meal.totalProtein || 0) + nutritionValues.protein;
  meal.totalCarbs = (meal.totalCarbs || 0) + nutritionValues.carbs;
  meal.totalFat = (meal.totalFat || 0) + nutritionValues.fat;
}

function updateEntryTotals(entry) {
  entry.totalCalories = entry.meals.reduce((total, meal) => total + (meal.totalCalories || 0), 0);
  entry.totalProtein = entry.meals.reduce((total, meal) => total + (meal.totalProtein || 0), 0);
  entry.totalCarbs = entry.meals.reduce((total, meal) => total + (meal.totalCarbs || 0), 0);
  entry.totalFat = entry.meals.reduce((total, meal) => total + (meal.totalFat || 0), 0);
}



// Get all nutrition entries for a user
exports.getNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.find({ user: req.user._id }).populate({
      path: 'meals.foodItems.foodId',
      model: 'FoodItem', // Replace with the actual model name for food items
    });
    res.status(200).json(nutrition);
  } catch (error){
    res.status(500).json({ error: 'Failed to fetch nutrition entries' });
  }
};
// Get a specific nutrition entry by ID
exports.getNutritionById = async (req, res) => {
  try {
    const nutrition = await Nutrition.findById(req.params.id);
    if (!nutrition) {
      return res.status(404).json({ error: 'Nutrition entry not found' });
    }
      res.status(200).json(nutrition);
  }catch (error) {
    res.status(500).json({ error: 'Failed to fetch nutrition entry' });
  }
};
// Get Daily Nutrition
exports.getDailyNutrition = async (req, res) => {
  try {
    const {date} = req.params;
    const dailyNutrition = await Nutrition.findOne({ user: req.user._id, createdAt: new Date(date) });
    return res.status(200).json(dailyNutrition);
  } catch (error) {
    console.error('Error fetching daily nutrition entry:', error);
    return res.status(500).json({ error: 'Failed to fetch daily nutrition entry' });
  }
};
// Update a nutrition entry
exports.updateNutrition = async (req, res) => {
  try {
    const { date, meals, totalCalories } = req.body;
    const nutrition = await Nutrition.findByIdAndUpdate(
      req.params.id,
      { date, meals, totalCalories },
      { new: true }
    );
    if (!nutrition) {
      return res.status(404).json({ error: 'Nutrition entry not found' });
    }
    res.status(200).json(nutrition);
  }catch (error) {
    res.status(500).json({ error: 'Failed to update nutrition entry' });
  }
};
// Delete a nutrition entry
exports.deleteNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findByIdAndDelete(req.params.id);
    if (!nutrition) {
      return res.status(404).json({ error: 'Nutrition entry not found' });
    }
    await User.findByIdAndUpdate(nutrition.user, {
      $pull: { nutrition: nutrition._id },
    });
    res.status(200).json({ message: 'Nutrition entry deleted successfully' });
  }catch(error) {
    res.status(500).json({ error: 'Failed to delete nutrition entry' });
  }
};

      