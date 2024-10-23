const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { createWorkout, getWorkouts, getWorkoutByDate } = require('../controllers/workoutController');
const { getWaterByDate } = require('../controllers/waterController');

// Create a new workout
router.post('/', authMiddleware, createWorkout);
// Get all workouts for a user
router.get('/', authMiddleware, getWorkouts);
router.get("/:date", authMiddleware, getWaterByDate);

module.exports = router;