const mongoose = require('mongoose');

const sleepTracker = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    bedTime: { type: String, required: true },
    wakeTime: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    quality: { type: Number, min: 1, max: 10, required: true },
    mood: { type: String, enum: ['Refreshed', 'Tired', 'Energetic', 'Groggy', 'Neutral'] },
}, {timestamps: true});

module.exports = mongoose.model('SleepTracker', sleepTracker);