const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { createGoal, getGoals, getGoalById, updateGoal, deleteGoal } = require('../controllers/goalController');

// Create a new fitness goal
router.post('/', authMiddleware, createGoal);
// Get all fitness goals for a user
router.get('/', authMiddleware, getGoals);
// Get a specific fitness goal by ID
router.get('/:id', authMiddleware, getGoalById);
// Update a fitness goal
router.put('/:id', authMiddleware, updateGoal);
// Delete a fitness goal
router.delete('/:id', authMiddleware,deleteGoal);

module.exports = router;