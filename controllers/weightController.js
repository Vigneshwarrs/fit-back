const WeightTracker = require('../models/WeightTracker');

exports.createWeight = async (req, res) => {
    try{
        const {weight, date, unit} = req.body;
        const userId = req.user._id;
        console.log(userId);
        const existingData = await WeightTracker.findOne({userId, date});
        if(existingData){
            existingData.weight = weight;
            existingData.unit = unit;
            await existingData.save();
            return res.json(existingData);
        }
        const newWeightTracker = new WeightTracker({userId, weight, date, unit});
        await newWeightTracker.save();
        return res.json(newWeightTracker);
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error", err});
    }
}

exports.getWeights = async (req, res) => {
    try{
        const userId = req.user._id;
        const weights = await WeightTracker.find({userId: userId}).sort({date: -1});
        console.log(weights);
        return res.json(weights);
    }catch(err) {
        console.error(err);
        res.status(500).json({message: "Server error", error});
    }
}

exports.getWeightByDate= async (req, res) => {
    try{
        const { userId, date } = req.params;
        const weight = await WeightTracker.findOne({userId, date});
        if(!weight){
            return res.status(404).json({message: "Weight not found"});
        }
        return res.json(weight);
    }catch(err) {
        console.error(err);
        res.status(500).json({message: "Server error", error});
    }
}

exports.deleteWeight = async (req, res) => {
    try{
        const { id } = req.params;
        const weight = await WeightTracker.findByIdAndDelete(id);
        if(!weight){
            return res.status(404).json({message: "Weight not found"});
        }
        return res.json(weight);
    }catch(err) {
        console.error(err);
        res.status(500).json({message: "Server error", error});
    }
}