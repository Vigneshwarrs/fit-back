const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { createWorkout, getWorkouts } = require('../controllers/workoutController');

// Create a new workout
router.post('/', authMiddleware, createWorkout);
// Get all workouts for a user
router.get('/', authMiddleware, getWorkouts);

module.exports = router;