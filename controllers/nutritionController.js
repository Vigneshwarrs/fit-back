// const Nutrition = require('../models/Nutrition');
// const FoodItem = require('../models/FoodItems');
// const User = require('../models/User');
// const {createFoodItemFromNutrition} = require('../controllers/foodItemController');
// exports.createNutrition = async (req, res) => {
//   try {
//     const { date, meals } = req.body;
//     const entryDate = new Date(date).setUTCHours(0,0,0,0);
//     console.log(date);

//     let nutritionEntry = await Nutrition.findOne({
//       user: req.user._id,
//       date: entryDate,
//     });

//     if (!nutritionEntry) {
//       nutritionEntry = new Nutrition({
//         user: req.user._id,
//         date: entryDate,
//         meals: []
//       });
//     }

//     for (const [mealType, foodItems] of Object.entries(meals)) {
//       const mealIndex = nutritionEntry.meals.findIndex(meal => meal.name === mealType);
//       const meal = mealIndex !== -1 ? nutritionEntry.meals[mealIndex] : { name: mealType, foodItems: [] };

//       for (const foodItem of foodItems) {
//         const existFoodItem = await getFoodItem(foodItem);
//         if (!existFoodItem) {
//           return res.status(400).json({ error: 'Invalid food item details' });
//         }

//         const nutritionValues = calculateNutritionValues(existFoodItem, foodItem.quantity);
//         meal.foodItems.push({
//           foodId: existFoodItem._id,
//           quantity: foodItem.quantity,
//           ...nutritionValues
//         });

//         updateMealTotals(meal, nutritionValues);
//       }

//       if (mealIndex === -1) {
//         nutritionEntry.meals.push(meal);
//       }
//     }

//     updateEntryTotals(nutritionEntry);

//     await nutritionEntry.save();

//     if (!nutritionEntry.isNew) {
//       await User.findByIdAndUpdate(req.user._id, {
//         $addToSet: { nutrition: nutritionEntry._id },
//       });
//     }

//     return res.status(nutritionEntry.isNew ? 201 : 200).json(nutritionEntry);
//   } catch (error) {
//     console.error('Error in creating/updating nutrition entry:', error);
//     return res.status(500).json({ error: 'Failed to create or update daily nutrition entry' });
//   }
// };

// async function getFoodItem(foodItem) {
//   let existFoodItem = await FoodItem.findOne({ name: foodItem.name });
//   if (!existFoodItem && foodItem.customFoodName) {
//     if (!foodItem.calories || !foodItem.protein || !foodItem.carbs || !foodItem.fat) {
//       throw new Error('Custom food item must include calories, protein, carbs, and fat.');
//     }
//     existFoodItem = await createFoodItemFromNutrition(foodItem);
//   }
//   return existFoodItem;
// }

// function calculateNutritionValues(foodItem, quantity) {
//   return {
//     calories: foodItem.caloriesPerGram * quantity,
//     protein: foodItem.proteinPerGram * quantity,
//     carbs: foodItem.carbsPerGram * quantity,
//     fat: foodItem.fatPerGram * quantity
//   };
// }

// function updateMealTotals(meal, nutritionValues) {
//   meal.totalCalories = (meal.totalCalories || 0) + nutritionValues.calories;
//   meal.totalProtein = (meal.totalProtein || 0) + nutritionValues.protein;
//   meal.totalCarbs = (meal.totalCarbs || 0) + nutritionValues.carbs;
//   meal.totalFat = (meal.totalFat || 0) + nutritionValues.fat;
// }

// function updateEntryTotals(entry) {
//   entry.totalCalories = entry.meals.reduce((total, meal) => total + (meal.totalCalories || 0), 0);
//   entry.totalProtein = entry.meals.reduce((total, meal) => total + (meal.totalProtein || 0), 0);
//   entry.totalCarbs = entry.meals.reduce((total, meal) => total + (meal.totalCarbs || 0), 0);
//   entry.totalFat = entry.meals.reduce((total, meal) => total + (meal.totalFat || 0), 0);
// }



// // Get all nutrition entries for a user
// exports.getNutrition = async (req, res) => {
//   try {
//     const nutrition = await Nutrition.find({ user: req.user._id }).populate({
//       path: 'meals.foodItems.foodId',
//       model: 'FoodItem', // Replace with the actual model name for food items
//     });
//     res.status(200).json(nutrition);
//   } catch (error){
//     res.status(500).json({ error: 'Failed to fetch nutrition entries' });
//   }
// };
// // Get a specific nutrition entry by ID
// exports.getNutritionById = async (req, res) => {
//   try {
//     const nutrition = await Nutrition.findById(req.params.id);
//     if (!nutrition) {
//       return res.status(404).json({ error: 'Nutrition entry not found' });
//     }
//       res.status(200).json(nutrition);
//   }catch (error) {
//     res.status(500).json({ error: 'Failed to fetch nutrition entry' });
//   }
// };
// // Get Daily Nutrition
// exports.getDailyNutrition = async (req, res) => {
//   try {
//     const {date} = req.params;
//     const dailyNutrition = await Nutrition.find({ user: req.user._id});
//     console.log(dailyNutrition);
//     return res.status(200).json(dailyNutrition);
//   } catch (error) {
//     console.error('Error fetching daily nutrition entry:', error);
//     return res.status(500).json({ error: 'Failed to fetch daily nutrition entry' });
//   }
// };
// // Update a nutrition entry
// exports.updateNutrition = async (req, res) => {
//   try {
//     const { date, meals, totalCalories } = req.body;
//     const nutrition = await Nutrition.findByIdAndUpdate(
//       req.params.id,
//       { date, meals, totalCalories },
//       { new: true }
//     );
//     if (!nutrition) {
//       return res.status(404).json({ error: 'Nutrition entry not found' });
//     }
//     res.status(200).json(nutrition);
//   }catch (error) {
//     res.status(500).json({ error: 'Failed to update nutrition entry' });
//   }
// };
// // Delete a nutrition entry
// exports.deleteNutrition = async (req, res) => {
//   try {
//     const nutrition = await Nutrition.findByIdAndDelete(req.params.id);
//     if (!nutrition) {
//       return res.status(404).json({ error: 'Nutrition entry not found' });
//     }
//     await User.findByIdAndUpdate(nutrition.user, {
//       $pull: { nutrition: nutrition._id },
//     });
//     res.status(200).json({ message: 'Nutrition entry deleted successfully' });
//   }catch(error) {
//     res.status(500).json({ error: 'Failed to delete nutrition entry' });
//   }
// };

const Nutrition = require('../models/Nutrition');
const FoodItem = require('../models/FoodItems');
const User = require('../models/User');
const { createFoodItemFromNutrition } = require('../controllers/foodItemController');
const { startOfDay, endOfDay, subDays, startOfWeek, startOfMonth } = require('date-fns');


// Custom error class for nutrition-related errors
class NutritionError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'NutritionError';
  }
}

// Validation functions
const validateMealData = (meals) => {
  if (!meals || typeof meals !== 'object') {
    throw new NutritionError('Meals data is required and must be an object');
  }

  for (const [mealType, foodItems] of Object.entries(meals)) {
    if (!Array.isArray(foodItems)) {
      throw new NutritionError(`Food items for meal "${mealType}" must be an array`);
    }

    for (const item of foodItems) {
      if (!item.name || typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new NutritionError(
          `Invalid food item in meal "${mealType}". Name and positive quantity are required`
        );
      }
    }
  }
};

const validateCustomFoodItem = (foodItem) => {
  const requiredFields = ['calories', 'protein', 'carbs', 'fat'];
  const missingFields = requiredFields.filter(field => !foodItem[field]);
  
  if (missingFields.length > 0) {
    throw new NutritionError(
      `Custom food item missing required fields: ${missingFields.join(', ')}`
    );
  }

  // Validate nutritional values are positive numbers
  requiredFields.forEach(field => {
    if (typeof foodItem[field] !== 'number' || foodItem[field] < 0) {
      throw new NutritionError(
        `Invalid ${field} value for custom food item. Must be a positive number`
      );
    }
  });
};

// Utility functions
const calculateNutritionValues = (foodItem, quantity) => ({
  calories: Math.round(foodItem.caloriesPerGram * quantity * 100) / 100,
  protein: Math.round(foodItem.proteinPerGram * quantity * 100) / 100,
  carbs: Math.round(foodItem.carbsPerGram * quantity * 100) / 100,
  fat: Math.round(foodItem.fatPerGram * quantity * 100) / 100
});

const updateMealTotals = (meal) => {
  meal.totalCalories = Math.round(meal.foodItems.reduce((sum, item) => sum + item.calories, 0) * 100) / 100;
  meal.totalProtein = Math.round(meal.foodItems.reduce((sum, item) => sum + item.protein, 0) * 100) / 100;
  meal.totalCarbs = Math.round(meal.foodItems.reduce((sum, item) => sum + item.carbs, 0) * 100) / 100;
  meal.totalFat = Math.round(meal.foodItems.reduce((sum, item) => sum + item.fat, 0) * 100) / 100;
};

const updateEntryTotals = (entry) => {
  entry.totalCalories = Math.round(entry.meals.reduce((sum, meal) => sum + meal.totalCalories, 0) * 100) / 100;
  entry.totalProtein = Math.round(entry.meals.reduce((sum, meal) => sum + meal.totalProtein, 0) * 100) / 100;
  entry.totalCarbs = Math.round(entry.meals.reduce((sum, meal) => sum + meal.totalCarbs, 0) * 100) / 100;
  entry.totalFat = Math.round(entry.meals.reduce((sum, meal) => sum + meal.totalFat, 0) * 100) / 100;
};

// Controller functions
exports.createNutrition = async (req, res) => {
  try {
    const { date, meals } = req.body;
    validateMealData(meals);

    const entryDate = startOfDay(new Date(date));
    
    // Find or create nutrition entry for the given date
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

    // Process each meal and its food items
    for (const [mealType, foodItems] of Object.entries(meals)) {
      const mealIndex = nutritionEntry.meals.findIndex(meal => meal.name === mealType);
      const meal = mealIndex !== -1 ? nutritionEntry.meals[mealIndex] : { name: mealType, foodItems: [] };

      for (const foodItem of foodItems) {
        const existingFoodItem = await getFoodItem(foodItem);
        if (!existingFoodItem) {
          throw new NutritionError(`Food item "${foodItem.name}" not found`);
        }

        meal.foodItems.push({
          foodId: existingFoodItem._id,
          quantity: foodItem.quantity,
          ...calculateNutritionValues(existingFoodItem, foodItem.quantity)
        });
      }

      updateMealTotals(meal);

      if (mealIndex === -1) {
        nutritionEntry.meals.push(meal);
      }
    }

    updateEntryTotals(nutritionEntry);
    await nutritionEntry.save();

    // Update user's nutrition references if it's a new entry
    if (nutritionEntry.isNew) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { nutrition: nutritionEntry._id },
      });
    }

    return res.status(nutritionEntry.isNew ? 201 : 200).json({
      message: `Nutrition entry ${nutritionEntry.isNew ? 'created' : 'updated'} successfully`,
      data: nutritionEntry
    });

  } catch (error) {
    console.error('Error in creating/updating nutrition entry:', error);
    const statusCode = error instanceof NutritionError ? error.statusCode : 500;
    return res.status(statusCode).json({ 
      error: error.message || 'Failed to create or update daily nutrition entry'
    });
  }
};

exports.getNutrition = async (req, res) => {
  try {
    const { startDate, endDate, limit = 30, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: startOfDay(new Date(startDate)),
        $lte: endOfDay(new Date(endDate))
      };
    }

    const [nutrition, total] = await Promise.all([
      Nutrition.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('meals.foodItems.foodId', 'name caloriesPerGram proteinPerGram carbsPerGram fatPerGram'),
      Nutrition.countDocuments(query)
    ]);

    res.status(200).json({
      data: nutrition,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nutrition entries' });
  }
};

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

exports.getDailyNutrition = async (req, res) => {
  try {
    const { date } = req.params;
    const queryDate = startOfDay(new Date(date));

    const dailyNutrition = await Nutrition.findOne({
      user: req.user._id,
      date: queryDate
    });

    // if (!dailyNutrition) {
    //   return res.status(404).json({ 
    //     message: 'No nutrition entry found for the specified date',
    //     data: null
    //   });
    // }

    // Calculate daily goals progress
    const userGoals = req.user.nutritionGoals || {
      calories: 2000,
      protein: 150,
      carbs: 250,
      fat: 70
    };

    const progress = {
      calories: (dailyNutrition?.totalCalories / userGoals.calories) * 100,
      protein: (dailyNutrition?.totalProtein / userGoals.protein) * 100,
      carbs: (dailyNutrition?.totalCarbs / userGoals.carbs) * 100,
      fat: (dailyNutrition?.totalFat / userGoals.fat) * 100
    };

    return res.status(200).json({
      data: dailyNutrition,
      goals: userGoals,
      progress
    });

  } catch (error) {
    console.error('Error fetching daily nutrition entry:', error);
    return res.status(500).json({ error: 'Failed to fetch daily nutrition entry' });
  }
};

exports.updateNutrition = async (req, res) => {
  try {
    const { meals } = req.body;
    validateMealData(meals);

    const nutritionEntry = await Nutrition.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!nutritionEntry) {
      throw new NutritionError('Nutrition entry not found', 404);
    }

    // Clear existing meals and add updated ones
    nutritionEntry.meals = [];
    
    for (const [mealType, foodItems] of Object.entries(meals)) {
      const meal = { name: mealType, foodItems: [] };

      for (const foodItem of foodItems) {
        const existingFoodItem = await getFoodItem(foodItem);
        if (!existingFoodItem) {
          throw new NutritionError(`Food item "${foodItem.name}" not found`);
        }

        meal.foodItems.push({
          foodId: existingFoodItem._id,
          quantity: foodItem.quantity,
          ...calculateNutritionValues(existingFoodItem, foodItem.quantity)
        });
      }

      updateMealTotals(meal);
      nutritionEntry.meals.push(meal);
    }

    updateEntryTotals(nutritionEntry);
    await nutritionEntry.save();

    res.status(200).json({
      message: 'Nutrition entry updated successfully',
      data: nutritionEntry
    });

  } catch (error) {
    const statusCode = error instanceof NutritionError ? error.statusCode : 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.deleteNutrition = async (req, res) => {
  try {
    const nutritionEntry = await Nutrition.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!nutritionEntry) {
      throw new NutritionError('Nutrition entry not found', 404);
    }

    await Promise.all([
      nutritionEntry.deleteOne(),
      User.findByIdAndUpdate(req.user._id, {
        $pull: { nutrition: nutritionEntry._id }
      })
    ]);

    res.status(200).json({ 
      message: 'Nutrition entry deleted successfully',
      deletedId: nutritionEntry._id
    });

  } catch (error) {
    const statusCode = error instanceof NutritionError ? error.statusCode : 500;
    res.status(statusCode).json({ error: error.message });
  }
};

async function getFoodItem(foodItem) {
  let existingFoodItem = await FoodItem.findOne({ name: foodItem.name });
  
  if (!existingFoodItem && foodItem.customFoodName) {
    try {
      validateCustomFoodItem(foodItem);
      existingFoodItem = await createFoodItemFromNutrition(foodItem);
    } catch (error) {
      throw new NutritionError(error.message);
    }
  }
  
  return existingFoodItem;
} 

// Add these methods to your existing nutritionController.js

exports.getNutritionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: startOfDay(new Date(startDate)),
        $lte: endOfDay(new Date(endDate))
      };
    }

    const stats = await Nutrition.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          averageCalories: { $avg: '$totalCalories' },
          averageProtein: { $avg: '$totalProtein' },
          averageCarbs: { $avg: '$totalCarbs' },
          averageFat: { $avg: '$totalFat' },
          highestCalorieDay: { $max: '$totalCalories' },
          lowestCalorieDay: { $min: '$totalCalories' },
          daysTracked: { $sum: 1 },
          totalEntries: { $sum: { $size: '$meals' } }
        }
      },
      {
        $project: {
          _id: 0,
          averageCalories: { $round: ['$averageCalories', 2] },
          averageProtein: { $round: ['$averageProtein', 2] },
          averageCarbs: { $round: ['$averageCarbs', 2] },
          averageFat: { $round: ['$averageFat', 2] },
          highestCalorieDay: { $round: ['$highestCalorieDay', 2] },
          lowestCalorieDay: { $round: ['$lowestCalorieDay', 2] },
          daysTracked: 1,
          totalEntries: 1
        }
      }
    ]);

    return res.status(200).json({
      data: stats[0] || {
        averageCalories: 0,
        averageProtein: 0,
        averageCarbs: 0,
        averageFat: 0,
        highestCalorieDay: 0,
        lowestCalorieDay: 0,
        daysTracked: 0,
        totalEntries: 0
      }
    });

  } catch (error) {
    console.error('Error fetching nutrition stats:', error);
    return res.status(500).json({ error: 'Failed to fetch nutrition statistics' });
  }
};

exports.getNutritionTrends = async (req, res) => {
  try {
    const { period, metric } = req.query;
    const endDate = new Date();
    let startDate;
    let groupBy;

    // Determine time range and grouping based on period
    switch (period) {
      case 'daily':
        startDate = subDays(endDate, 7);
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
        break;
      case 'weekly':
        startDate = subDays(endDate, 28);
        groupBy = { $dateToString: { format: '%Y-%U', date: '$date' } };
        break;
      case 'monthly':
        startDate = subDays(endDate, 90);
        groupBy = { $dateToString: { format: '%Y-%m', date: '$date' } };
        break;
      default:
        throw new Error('Invalid period specified');
    }

    const trends = await Nutrition.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(req.user._id),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          average: { $avg: `$total${metric.charAt(0).toUpperCase() + metric.slice(1)}` },
          min: { $min: `$total${metric.charAt(0).toUpperCase() + metric.slice(1)}` },
          max: { $max: `$total${metric.charAt(0).toUpperCase() + metric.slice(1)}` }
        }
      },
      {
        $project: {
          _id: 0,
          period: '$_id',
          average: { $round: ['$average', 2] },
          min: { $round: ['$min', 2] },
          max: { $round: ['$max', 2] }
        }
      },
      { $sort: { period: 1 } }
    ]);

    return res.status(200).json({
      data: trends,
      metadata: {
        metric,
        period,
        startDate,
        endDate
      }
    });

  } catch (error) {
    console.error('Error fetching nutrition trends:', error);
    return res.status(500).json({ error: 'Failed to fetch nutrition trends' });
  }
};

exports.bulkCreateNutrition = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { entries } = req.body;
    const createdEntries = [];
    const updatedEntries = [];

    for (const entry of entries) {
      const entryDate = startOfDay(new Date(entry.date));
      
      let nutritionEntry = await Nutrition.findOne({
        user: req.user._id,
        date: entryDate
      }).session(session);

      if (nutritionEntry) {
        // Update existing entry
        nutritionEntry.meals = entry.meals;
        updateEntryTotals(nutritionEntry);
        await nutritionEntry.save({ session });
        updatedEntries.push(nutritionEntry);
      } else {
        // Create new entry
        nutritionEntry = new Nutrition({
          user: req.user._id,
          date: entryDate,
          meals: entry.meals
        });
        updateEntryTotals(nutritionEntry);
        await nutritionEntry.save({ session });
        createdEntries.push(nutritionEntry);
      }
    }

    // Update user's nutrition references for new entries
    if (createdEntries.length > 0) {
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $addToSet: { 
            nutrition: { 
              $each: createdEntries.map(entry => entry._id) 
            } 
          }
        },
        { session }
      );
    }

    await session.commitTransaction();

    return res.status(200).json({
      message: 'Bulk operation completed successfully',
      created: createdEntries.length,
      updated: updatedEntries.length,
      entries: [...createdEntries, ...updatedEntries]
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Error in bulk nutrition creation:', error);
    return res.status(500).json({ error: 'Failed to process bulk nutrition entries' });
  } finally {
    session.endSession();
  }
};