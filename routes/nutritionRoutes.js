const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { createNutrition, getNutrition, getNutritionById, getDailyNutrition, updateNutrition, deleteNutrition } = require('../controllers/nutritionController');

//create a new nutrition entry
router.post('/', authMiddleware, createNutrition);
//get all nutrition entries for a user
router.get('/', authMiddleware, getNutrition);
//get a specific nutrition entry by ID
router.get('/:id', authMiddleware, getNutritionById);
//get daily nutrition
router.get('/daily/:date', authMiddleware, getDailyNutrition);
//update a nutrition entry
router.put('/:id', authMiddleware, updateNutrition);
//delete a nutrition entry
router.delete('/:id', authMiddleware, deleteNutrition);


module.exports = router;