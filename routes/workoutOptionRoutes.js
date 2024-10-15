const express = require('express');
const router = express.Router();
const { createWorkoutOption, getAllWorkoutOptions, getWorkoutOptionById } = require('../controllers/workoutOptionController');
// Create a new workout option
router.post('/', createWorkoutOption);
// Get all workout options
router.get('/', getAllWorkoutOptions);
// Get a specific workout option by ID
router.get('/:id', getWorkoutOptionById);
module.exports = router;