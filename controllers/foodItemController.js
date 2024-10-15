const FoodItem = require('../models/FoodItems');

exports.createFoodItem = async (req, res) => {
  try {
    const { name, caloriesPerGram, proteinPerGram, carbsPerGram, fatPerGram, mealType } = req.body;
    const foodItem = new FoodItem({
      name,
      caloriesPerGram,
      proteinPerGram,
      carbsPerGram,
      fatPerGram,
      mealType
    });
    await foodItem.save();
    res.status(201).json(foodItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create food item' });
    console.log(error);
  }
};

exports.createFoodItemFromNutrition = async (foodItem) => {
  const newFoodItem = new FoodItem({
    name: foodItem.customFoodName,
    caloriesPerGram: foodItem.calories/foodItem.quantity,
    proteinPerGram: foodItem.protein/foodItem.quantity,
    carbsPerGram: foodItem.carbs/foodItem.quantity,
    fatPerGram: foodItem.fat/foodItem.quantity,
    mealType: foodItem.name // Optionally, you can set this if needed
  });
  return await newFoodItem.save();
};

exports.getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch food items' });
  }
};
exports.getFoodItemById = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.status(200).json(foodItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch food item' });
  }
};
exports.updateFoodItem = async (req, res) => {
  try {
    const { name, caloriesPerGram, proteinPerGram, carbsPerGram, fatPerGram, mealType } = req.body;
    const foodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { name, caloriesPerGram, proteinPerGram, carbsPerGram, fatPerGram, quantity, mealType },
      { new: true });
      if (!foodItem) {
        return res.status(404).json({ error: 'Food item not found' });
      }
      res.status(200).json(foodItem);
    }catch (error) {
      res.status(500).json({ error: 'Failed to update food item' });
    }
};
exports.deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete food item' });
  }
};