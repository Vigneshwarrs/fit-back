const mongoose = require('mongoose');

const WaterTracker = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    glassCount: { type: Number, required: true},
    goal: { type: Number, required: true}
},{timestamps: true });

module.exports = mongoose.model('waterTracker', WaterTracker);