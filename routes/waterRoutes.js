// const express = require('express');
// const router = express.Router();
// const protect = require('../middlewares/auth');
// const {createWater, getWaters, getWaterByDate, deleteWater} = require('../controllers/waterController');

// router.post('/', protect, createWater);
// router.get('/', protect, getWaters);
// router.get('/:date', protect, getWaterByDate);
// router.delete("/", protect, deleteWater);

// module.exports = router;
const express = require('express');
const protect = require('../middlewares/auth');
const {updateWaterIntake, getWaterEntries, getTodayEntry, getStats} = require('../controllers/waterController');

const router = express.Router();


router.post('/', protect, updateWaterIntake);
router.get('/', protect, getWaterEntries);
router.get('/today', protect, getTodayEntry);
router.get('/stats', protect, getStats);

module.exports = router;