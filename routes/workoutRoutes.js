const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { createWorkout, getWorkouts, getWorkoutByDate } = require('../controllers/workoutController');

router.post('/', authMiddleware, createWorkout);
router.get('/', authMiddleware, getWorkouts);
router.get("/:date", authMiddleware, getWorkoutByDate);

module.exports = router;