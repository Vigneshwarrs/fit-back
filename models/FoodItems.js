const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    caloriesPerGram: {
        type: Number,
        required: true
    },
    proteinPerGram: {
        type: Number,
        required: true
    },
    carbsPerGram: {
        type: Number,
        required: true
    },
    fatPerGram: {
        type: Number,
        required: true
    },
    mealType: {
        type: String,
    }
}, { timestamps: true });
const FoodItem = mongoose.model('FoodItem', foodItemSchema);
module.exports = FoodItem;