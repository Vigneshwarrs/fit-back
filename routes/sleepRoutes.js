const express = require('express');
const router = express.Router();
const {createSleepTracker, getSleepTracker, getSleepTrackerByDate, updateSleepTracker, deleteSleepTracker} = require('../controllers/sleepController');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware, createSleepTracker);
router.get('/', authMiddleware, getSleepTracker);
router.get('/:date', authMiddleware, getSleepTrackerByDate);
router.put('/:date', authMiddleware, updateSleepTracker);
router.delete('/:date', authMiddleware, deleteSleepTracker);

module.exports = router;