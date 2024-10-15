const mongoose = require('mongoose');

const workoutOptionSchema = new mongoose.Schema({
    workoutName: {
        type: String,
        required: true,
    },
    workoutType: {
        type: String,
        required: true,
    },
    description: String,
    caloriesBurnedPerRep: {
        type: Number,
        required: function () {
            return this.workoutType === 'strength';
        },
        default: null,
    },
    caloriesBurnedPerMinute: {
        type: Number,
        required: function () {
            return this.workoutType === 'cardio';
        },
        default: null,
    },
}, { timestamps: true });

const WorkoutOption = mongoose.model('WorkoutOption', workoutOptionSchema);
module.exports = WorkoutOption;
