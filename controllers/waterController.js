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


exports.updateWaterIntake = async (req, res) => {
    try {
      const { date, glassCount, goal } = req.body;
      const validGlassCount = Number.isFinite(Number(glassCount)) ? Number(glassCount) : 0;
      const userId = req.user._id;

    //   const entry = await WaterEntry.findOneAndUpdate(
    //     { 
    //       userId,
    //       date: {
    //         $gte: startOfDay(new Date(date)),
    //         $lte: endOfDay(new Date(date))
    //       }
    //     },
    //     { 
    //       new: true,
    //       upsert: true,
    //       runValidators: true
    //     }
    //   );
      const existEntry = await WaterEntry.findOne({userId, date});
      if (!existEntry) {
        const newEntry = new WaterEntry({
            userId,
            date,
            glassCount: validGlassCount,
            goal,
            totalMilliliters: 0
          });
          const response = await newEntry.save();
          return res.status(201).json(response);
      }
      
      existEntry.glassCount = validGlassCount;
      existEntry.totalMilliliters += validGlassCount * 250;
      existEntry.goal = goal;
      const entry = await existEntry.save();
      res.json(entry);
    } catch (error) {
        console.error(error);
      res.status(400).json({ error: error.message });
    }
  };

  // Get water entries for a date range
exports.getWaterEntries = async (req, res)=> {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user._id;

      const query = {
        userId,
        date: {}
      };

      if (startDate) {
        query.date.$gte = startOfDay(new Date(startDate));
      }
      if (endDate) {
        query.date.$lte = endOfDay(new Date(endDate));
      }

      const entries = await WaterEntry.find(query)
        .sort({ date: -1 })
        .limit(30);

      res.json(entries);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get statistics
exports.getStats = async (req, res) => {
    try {
      const userId = req.user._id;
      const today = new Date();
      const thirtyDaysAgo = subDays(today, 30);

      const entries = await WaterEntry.find({
        userId,
        date: { $gte: thirtyDaysAgo, $lte: today }
      });

      // Calculate statistics
      const totalEntries = entries.length;
      const totalWater = entries.reduce((sum, entry) => sum + entry.totalMilliliters, 0);
      const goalsAchieved = entries.filter(entry => entry.glassCount >= entry.goal).length;
      const achievementRate = totalEntries > 0 ? (goalsAchieved / totalEntries) * 100 : 0;

      // Calculate streaks
      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;

      for (let i = 0; i < entries.length; i++) {
        if (entries[i].glassCount >= entries[i].goal) {
          tempStreak++;
          bestStreak = Math.max(bestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }
      currentStreak = tempStreak;

      res.json({
        totalWater,
        achievementRate,
        currentStreak,
        bestStreak,
        entriesCount: totalEntries
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get today's entry
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
        // Return default values if no entry exists
        return res.json({
          date: today,
          glassCount: 0,
          goal: req.user.defaultGoal,
          totalMilliliters: 0
        });
      }

      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};