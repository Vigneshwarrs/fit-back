const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const {createWater, getWaters, getWaterByDate, deleteWater} = require('../controllers/waterController');

router.post('/', protect, createWater);
router.get('/', protect, getWaters);
router.get('/:date', protect, getWaterByDate);
router.delete("/", protect, deleteWater);

module.exports = router;