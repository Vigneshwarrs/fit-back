const SleepTracker = require('../models/SleepTracker');

exports.createSleepTracker = async (req, res) => {
    try {
        const {date, bedTime, wakeTime, duration, quality, mood} = req.body;
        const existingData = await SleepTracker.findOne({date: date});
        if (!existingData) {
            const userId = req.user._id;
            const sleepTracker = new SleepTracker({
                userId,
                date,
                bedTime,
                wakeTime,
                duration,
                quality,
                mood
            });
            await sleepTracker.save();
            res.status(201).send(sleepTracker);
        }else {
            existingData.bedTime = bedTime;
            existingData.wakeTime = wakeTime;
            existingData.duration = duration;
            existingData.quality = quality;
            existingData.mood = mood;
            await existingData.save();
            res.send(existingData);
        }
    }catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

exports.getSleepTracker = async (req, res) => {
    try {
        const sleepTracker = await SleepTracker.find({userId: req.user._id});
        if (!sleepTracker) return res.status(404).send('Sleep Tracker not found');
        res.send(sleepTracker);
    }catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

exports.getSleepTrackerByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const sleepTracker = await SleepTracker.findOne({userId: req.user._id, date: new Date(date.trim())});
        res.send(sleepTracker);
    }catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

exports.updateSleepTracker = async (req, res) => {
    try {
        const { date } = req.params;
        const { bedTime, wakeTime, duration, quality, mood } = req.body;
        const sleepTracker = await SleepTracker.findOneAndUpdate(date, {
            bedTime,
            wakeTime,
            duration,
            quality,
            mood
        }, {new: true});
        if (!sleepTracker) return res.status(404).send('Sleep Tracker not found');
        res.send(sleepTracker);
    }catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

exports.deleteSleepTracker = async (req, res) => {
    try {
        const { date } = req.params;
        const sleepTracker = await SleepTracker.findOneAndDelete(date);
        if (!sleepTracker) return res.status(404).send('Sleep Tracker not found');
        res.send(sleepTracker);
    }catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}