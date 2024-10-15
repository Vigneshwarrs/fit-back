const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    goalName: {
        type: String,
        required: true,
        enum: ['weight-loss', 'weight-gain', 'strength'],
    },
    description: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    targetWeight: {
        type: Number,
        required: function () {
            return this.goalName === 'weight-loss' || this.goalName === 'weight-gain';
        },
    },
    targetDate: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
