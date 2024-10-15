const WorkoutOption = require('../models/WorkoutOptions');
exports.createWorkoutOption = async (req, res) => {
    try {
        const { workoutName, workoutType, description, caloriesBurnedPerSet, caloriesBurnedPerMinute } = req.body;
        const workoutOption = new WorkoutOption({
            workoutName,
            workoutType,
            description,
            caloriesBurnedPerRep,
            caloriesBurnedPerMinute,
        });
        await workoutOption.save();
        res.status(201).json(workoutOption);
    }catch (error) {
        res.status(500).json({ error: 'Failed to create workout option' });
        console.log(error);
    }
};
exports.createWorkoutOptionFromWorkout = async (workoutOptionData) => {
    const newWorkoutOption = new WorkoutOption({
        workoutName: workoutOptionData.workoutName,
        workoutType: workoutOptionData.workoutType,
        description: workoutOptionData.description,
        caloriesBurnedPerRep: workoutOptionData.caloriesBurnedPerRep,
        caloriesBurnedPerMinute: workoutOptionData.caloriesBurnedPerMinute,
    });
    return await newWorkoutOption.save();
};
exports.getAllWorkoutOptions = async (req, res) => {
    try {
        const workoutOptions = await WorkoutOption.find();
        res.status(200).json(workoutOptions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch workout options' });
    }
};
exports.getWorkoutOptionById = async (req, res) => {
    try {
        const workoutOption = await WorkoutOption.findById(req.params.id);
        if (!workoutOption) {
            return res.status(404).json({ error: 'Workout option not found' });
        }
        res.status(200).json(workoutOption);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch workout option' });
    }
};