const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    workoutName: {
        type: String,
        required: true,
    },
    workoutType: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    sets: {
        type: Number,
        required: function () {
            return this.workoutType === 'strength';
        },
        default: null,
    },
    reps: {
        type: Number,
        required: function () {
            return this.workoutType === 'strength';
        },
        default: null,
    },
    weightPerSet: {
        type: Number,
        required: function () {
            return this.workoutType === 'strength';
        },
        default: null,
    },
    duration: {
        type: Number,
        required: function () {
            return this.workoutType === 'cardio';
        },
        default: null,
    },
    caloriesBurned: {
        type: Number,
        required: function () {
            return this.workoutType === 'cardio';
        },
        default: null,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;
