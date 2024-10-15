const {createFoodItem,getAllFoodItems,getFoodItemById,updateFoodItem,deleteFoodItem} = require('../controllers/foodItemController');
const express = require('express');
const routes = express.Router();
// Create a new food item
routes.post('/', createFoodItem);
// Get all food items
routes.get('/', getAllFoodItems);
// Get a specific food item by ID
routes.get('/:id', getFoodItemById);
// Update a food item
routes.put('/:id', updateFoodItem);
// Delete a food item
routes.delete('/:id', deleteFoodItem);
module.exports = routes;