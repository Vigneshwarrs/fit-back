const WaterTracker = require("../models/WaterTracker");

exports.createWater = async (req, res) => {
    try {
        const userId = req.user._id;
        const {date, glassCount, goal} = req.body;
        const normalizedDate = new Date(data).setUTCHours(0,0,0,0); 
        const existingData = await WaterTracker.findOne({userId, date: normalizedDate});
        if (existingData) {
            existingData.glassCount = glassCount;
            existingData.goal = goal;
            const response = await existingData.save();
            return res.status(201).json(response);
        }
        const newData = await WaterTracker({userId, date: normalizedDate, glassCount, goal});
        await newData.save();
        res.status(201).json(newData);
    }catch(err) {
        console.error(err);
        res.status(500).status(err.message);
    }
}

exports.getWaters = async (req, res) => {
    try {
        const userId = req.user._id;
        const data = await WaterTracker.find({userId}).sort({date: -1});
        res.json(data);
    } catch(err) {
        console.error(err);
        res.status(500).status(err.message);
    }
}

exports.getWaterByDate = async (req, res) => {
    try {
        const userId = req.user._id;
        const { date } = req.params;
        const normalizedDate = new Date(date).setUTCHours(0,0,0,0);
        const data = await WaterTracker.findOne({userId, date: normalizedDate});
        res.json(data);
    } catch(err) {
        console.error(err);
        res.status(500).status(err.message);
    }
}

exports.updateWater = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const { glassCount, goal } = req.body;
        const existingData = await WaterTracker.findOneAndUpdate({userId, _id: id}, {glassCount, goal}, {new: true});
        if (!existingData) return res.status(404).send();
        res.json(existingData);
    } catch(err) {
        console.error(err);
        res.status(500).status(err.message);
    }
}

exports.deleteWater = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        await WaterTracker.findByIdAndDelete({userId, _id: id});
        res.status(204).send();
    } catch(err) {
        console.error(err);
        res.status(500).status(err.message);
    }
}