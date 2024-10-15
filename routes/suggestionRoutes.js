// const express = require('express');
// const { suggestionsNutrition, suggestionsWorkout } = require('../controllers/suggestionController');
// const authMiddleware = require('../middlewares/auth')
// const router = express.Router();


// router.get('/nutrition', authMiddleware,  suggestionsNutrition);
// router.get('/workout',authMiddleware, suggestionsWorkout);

// module.exports = router;
const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware,  suggestionController.getSuggestions);

module.exports = router;