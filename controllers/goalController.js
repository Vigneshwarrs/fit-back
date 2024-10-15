const Goal = require('../models/Goal');
const User = require("../models/User")

exports.createGoal = async (req, res) => {
    const { goalType, description, startDate, targetWeight, targetDate } = req.body;
    
    try {
        const goal = new Goal({
            goalName: goalType,
            description,
            startDate: startDate || new Date(),
            targetWeight,
            targetDate,
            user: req.user._id,
        });
        const user = await User.findById(req.user._id);
        const newGoal = await goal.save();
        user.goal = newGoal._id;
        await user.save();
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
        console.log(error);
    }
}

exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user._id });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.updateGoal = async (req, res) => {
    const { goalName, description, startDate, targetWeight, targetDate } = req.body;
    const goalId = req.params.id;
    try {
        const goal = await Goal.findById(goalId);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        goal.goalName = goalName;
        goal.description = description;
        goal.startDate = startDate;
        goal.targetWeight = targetWeight;
        goal.targetDate = targetDate;
        await goal.save();
        res.status(200).json(goal);
    }catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteGoal = async (req, res) => {
    const goalId = req.params.id;
    try {
        const goal = await Goal.findById(goalId);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        await goal.deleteOne();
        res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
        console.log(error)
    }
};
exports.getGoalById = async (req, res) => {
    const goalId = req.params.id;
    try {
        const goal = await Goal.findById(goalId);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};