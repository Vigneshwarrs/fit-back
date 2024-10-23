const mongoose = require('mongoose');

const WeightTracker = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    weight: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'lbs'], required: true },
},{timestamps: true});

module.exports = mongoose.model('WeightTracker', WeightTracker);