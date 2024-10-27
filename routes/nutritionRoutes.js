// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middlewares/auth');
// const { createNutrition, getNutrition, getDailyNutrition, updateNutrition, deleteNutrition } = require('../controllers/nutritionController');

// //create a new nutrition entry
// router.post('/', authMiddleware, createNutrition);
// //get all nutrition entries for a user
// router.get('/', authMiddleware, getNutrition);
// //get daily nutrition
// router.get('/daily/:date', authMiddleware, getDailyNutrition);
// //update a nutrition entry
// router.put('/:id', authMiddleware, updateNutrition);
// //delete a nutrition entry
// router.delete('/:id', authMiddleware, deleteNutrition);


// module.exports = router;

const express = require('express');
const router = express.Router();
// const { body, query, param } = require('express-validator');
// const { isAuthenticated } = require('../middleware/auth');
const isAuthenticated = require('../middlewares/auth');
// const validate = require('../middleware/validate');
// const rateLimiter = require('../middleware/rateLimiter');
// const cache = require('../middleware/cache');
const nutritionController = require('../controllers/nutritionController');

/**
 * Input validation schemas
 */
// const createNutritionSchema = [
//   body('date')
//     .isISO8601()
//     .withMessage('Date must be a valid ISO 8601 date'),
  
//   body('meals')
//     .isObject()
//     .withMessage('Meals must be an object'),
  
//   body('meals.*.*.name')
//     .isString()
//     .trim()
//     .notEmpty()
//     .withMessage('Food item name is required'),
  
//   body('meals.*.*.quantity')
//     .isFloat({ min: 0 })
//     .withMessage('Quantity must be a positive number'),
  
//   // Validation for custom food items
//   body('meals.*.*.calories')
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage('Calories must be a positive number'),
  
//   body('meals.*.*.protein')
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage('Protein must be a positive number'),
  
//   body('meals.*.*.carbs')
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage('Carbs must be a positive number'),
  
//   body('meals.*.*.fat')
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage('Fat must be a positive number')
// ];

// const getNutritionSchema = [
//   query('startDate')
//     .optional()
//     .isISO8601()
//     .withMessage('Start date must be a valid ISO 8601 date'),
  
//   query('endDate')
//     .optional()
//     .isISO8601()
//     .withMessage('End date must be a valid ISO 8601 date'),
  
//   query('page')
//     .optional()
//     .isInt({ min: 1 })
//     .withMessage('Page must be a positive integer'),
  
//   query('limit')
//     .optional()
//     .isInt({ min: 1, max: 100 })
//     .withMessage('Limit must be between 1 and 100')
// ];

// const nutritionIdSchema = [
//   param('id')
//     .isMongoId()
//     .withMessage('Invalid nutrition entry ID')
// ];

// const dateParamSchema = [
//   param('date')
//     .isISO8601()
//     .withMessage('Date must be a valid ISO 8601 date')
// ];

/**
 * Route configurations
 */

// Create nutrition entry
router.post(
  '/',
  isAuthenticated,
//   rateLimiter({ 
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
//   }),
//   createNutritionSchema,
//   validate,
  nutritionController.createNutrition
);

// Get all nutrition entries with pagination and filtering
router.get(
  '/',
  isAuthenticated,
//   cache.route({ ttl: 300 }), // Cache for 5 minutes
//   getNutritionSchema,
//   validate,
  nutritionController.getNutrition
);

// Get nutrition entry by ID
router.get(
  '/:id',
  isAuthenticated,
//   cache.route({ ttl: 300 }),
//   nutritionIdSchema,
//   validate,
  nutritionController.getNutritionById
);

// Get nutrition entry by date
router.get(
  '/daily/:date',
  isAuthenticated,
//   cache.route({ ttl: 300 }),
//   dateParamSchema,
//   validate,
  nutritionController.getDailyNutrition
);

// Update nutrition entry
router.put(
  '/:id',
  isAuthenticated,
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 100
//   }),
//   [
//     ...nutritionIdSchema,
//     ...createNutritionSchema
//   ],
//   validate,
  nutritionController.updateNutrition
);

// Delete nutrition entry
router.delete(
  '/:id',
  isAuthenticated,
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 50
//   }),
//   nutritionIdSchema,
//   validate,
  nutritionController.deleteNutrition
);

// Aggregate routes for statistics and analysis
router.get(
  '/stats/summary',
  isAuthenticated,
//   cache.route({ ttl: 600 }), // Cache for 10 minutes
//   [
//     query('startDate')
//       .optional()
//       .isISO8601()
//       .withMessage('Start date must be a valid ISO 8601 date'),
//     query('endDate')
//       .optional()
//       .isISO8601()
//       .withMessage('End date must be a valid ISO 8601 date'),
//     validate
//   ],
  nutritionController.getNutritionStats
);

// Get nutrition trends
router.get(
  '/stats/trends',
  isAuthenticated,
//   cache.route({ ttl: 600 }),
//   [
//     query('period')
//       .isIn(['daily', 'weekly', 'monthly'])
//       .withMessage('Period must be either daily, weekly, or monthly'),
//     query('metric')
//       .isIn(['calories', 'protein', 'carbs', 'fat'])
//       .withMessage('Metric must be either calories, protein, carbs, or fat'),
//     validate
//   ],
  nutritionController.getNutritionTrends
);

// Bulk operations
router.post(
  '/bulk',
  isAuthenticated,
//   rateLimiter({
//     windowMs: 60 * 60 * 1000, // 1 hour
//     max: 10 // limit each IP to 10 bulk operations per hour
//   }),
//   [
//     body('entries')
//       .isArray()
//       .withMessage('Entries must be an array'),
//     body('entries.*')
//       .custom((value) => {
//         if (!value.date || !value.meals) {
//           throw new Error('Each entry must have date and meals');
//         }
//         return true;
//       }),
//     validate
//   ],
  nutritionController.bulkCreateNutrition
);

module.exports = router;