// const WaterTracker = require("../models/WaterTracker");

// exports.createWater = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const {date, glassCount, goal} = req.body;
//         const normalizedDate = new Date(date).setUTCHours(0,0,0,0); 
//         const existingData = await WaterTracker.findOne({userId, date: normalizedDate});
//         if (existingData) {
//             existingData.glassCount = glassCount;
//             existingData.goal = goal;
//             const response = await existingData.save();
//             return res.status(201).json(response);
//         }
//         const newData = await WaterTracker({userId, date: normalizedDate, glassCount, goal});
//         await newData.save();
//         res.status(201).json(newData);
//     }catch(err) {
//         console.error(err);
//         res.status(500).status(err.message);
//     }
// }

// exports.getWaters = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const data = await WaterTracker.find({userId}).sort({date: -1});
//         res.json(data);
//     } catch(err) {
//         console.error(err);
//         res.status(500).status(err.message);
//     }
// }

// exports.getWaterByDate = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const { date } = req.params;
//         const normalizedDate = new Date(date).setUTCHours(0,0,0,0);
//         const data = await WaterTracker.findOne({userId, date: normalizedDate});
//         res.json(data);
//     } catch(err) {
//         console.error(err);
//         res.status(500).status(err.message);
//     }
// }

// exports.updateWater = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const { id } = req.params;
//         const { glassCount, goal } = req.body;
//         const existingData = await WaterTracker.findOneAndUpdate({userId, _id: id}, {glassCount, goal}, {new: true});
//         if (!existingData) return res.status(404).send();
//         res.json(existingData);
//     } catch(err) {
//         console.error(err);
//         res.status(500).status(err.message);
//     }
// }

// exports.deleteWater = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const { id } = req.params;
//         await WaterTracker.findByIdAndDelete({userId, _id: id});
//         res.status(204).send();
//     } catch(err) {
//         console.error(err);
//         res.status(500).status(err.message);
//     }
// }
const WaterEntry = require('../models/WaterTracker');
const { startOfDay, endOfDay, subDays } = require('date-fns');

const MILLILITERS_PER_GLASS = 250;

exports.updateWaterIntake = async (req, res) => {
  try {
    const { date, glassCount, goal } = req.body;
    
    // Input validation
    if (!date || !goal) {
      return res.status(400).json({ error: 'Date and goal are required' });
    }

    const validGlassCount = Number.isFinite(Number(glassCount)) ? Number(glassCount) : 0;
    const userId = req.user._id;

    const existingEntry = await WaterEntry.findOne({ 
      userId, 
      date: {
        $gte: startOfDay(new Date(date)),
        $lte: endOfDay(new Date(date))
      }
    });

    if (!existingEntry) {
      const newEntry = new WaterEntry({
        userId,
        date,
        glassCount: validGlassCount,
        goal,
        totalMilliliters: validGlassCount * MILLILITERS_PER_GLASS
      });
      const response = await newEntry.save();
      return res.status(201).json(response);
    }
    
    existingEntry.glassCount = validGlassCount;
    existingEntry.totalMilliliters = validGlassCount * MILLILITERS_PER_GLASS; // Fixed calculation
    existingEntry.goal = goal;
    
    const entry = await existingEntry.save();
    res.json(entry);
  } catch (error) {
    console.error('Error updating water intake:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getWaterEntries = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user._id;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const entries = await WaterEntry.find({
      userId,
      date: {
        $gte: startOfDay(new Date(startDate)),
        $lte: endOfDay(new Date(endDate))
      }
    })
      .sort({ date: -1 })
      .limit(30);

    res.json(entries);
  } catch (error) {
    console.error('Error fetching water entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);

    const entries = await WaterEntry.find({
      userId,
      date: { $gte: thirtyDaysAgo, $lte: today }
    }).sort({ date: -1 });

    const stats = calculateStats(entries);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTodayEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();

    const entry = await WaterEntry.findOne({
      userId,
      date: {
        $gte: startOfDay(today),
        $lte: endOfDay(today)
      }
    });

    if (!entry) {
      return res.json({
        date: today,
        glassCount: 0,
        goal: req.user.defaultGoal || 8, // Added fallback default goal
        totalMilliliters: 0
      });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error fetching today\'s entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function for stats calculation
const calculateStats = (entries) => {
  const totalEntries = entries.length;
  const totalWater = entries.reduce((sum, entry) => sum + entry.totalMilliliters, 0);
  const goalsAchieved = entries.filter(entry => entry.glassCount >= entry.goal).length;
  const achievementRate = totalEntries > 0 ? (goalsAchieved / totalEntries) * 100 : 0;

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // Calculate streaks
  entries.forEach(entry => {
    if (entry.glassCount >= entry.goal) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });
  currentStreak = tempStreak;

  return {
    totalWater,
    achievementRate: Number(achievementRate.toFixed(2)),
    currentStreak,
    bestStreak,
    entriesCount: totalEntries
  };
};