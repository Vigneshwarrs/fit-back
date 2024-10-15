const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  date: {
    type: String,
    required: true,
    default: () => new Date().toISOString().slice(0, 10), // Store date in YYYY-MM-DD format
  },
  meals: [
    {
      name: { type: String, required: true }, // e.g., 'Breakfast', 'Lunch'
      foodItems: [
        {
          foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
          quantity: { type: Number, required: true },
          calories: { type: Number, required: true }, // Store calories for this food item
          protein: { type: Number, required: true },
          carbs: { type: Number, required: true },
          fat: { type: Number, required: true },
        },
      ],
      totalCalories: { type: Number, default: 0 }, // Store total calories for the meal
      totalProtein: {type: Number, default: 0},
      totalCarbs: {type: Number, default: 0},
      totalFat: {type: Number, default: 0}
    },
  ],
  totalCalories: { type: Number, default: 0 }, // Store total calories for the day
  totalProtein: {type: Number, default: 0},
  totalCarbs: {type: Number, default: 0},
  totalFat: {type: Number, default: 0}
}, { timestamps: true });

const Nutrition = mongoose.model('Nutrition', nutritionSchema);
module.exports = Nutrition;
