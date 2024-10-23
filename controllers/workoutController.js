const Workout = require('../models/Workout');
const WorkoutOption = require('../models/WorkoutOptions');

exports.createWorkout = async (req, res) => {
    let { workoutName, customWorkoutName, workoutDate, workoutType, description, sets, reps, weightPerSet, duration, caloriesBurned } = req.body;
    const normalizedDate = new Date(workoutDate).setUTCHours(0,0,0,0);
    try {
        let workoutOption = await WorkoutOption.findOne({ workoutName: workoutName });

        if (!workoutOption) {
            const newWorkout = new Workout({
                workoutName: customWorkoutName,
                workoutType,
                date: normalizedDate,
                description,
                sets,
                reps,
                weightPerSet,
                duration,
                caloriesBurned,
                user: req.user._id, 
            });
            await newWorkout.save();
            return res.status(201).json(newWorkout);   

        }

        // Calculate calories burned based on workout type
        if (workoutOption.workoutType === 'strength') {
            if (!sets || !reps) {
                return res.status(400).json({ message: 'Sets and reps are required for strength workouts' });
            }

            // Calculate calories burned for strength workouts
            caloriesBurned = workoutOption.caloriesBurnedPerRep * sets * reps;
        } else if (workoutOption.workoutType === 'cardio') {
            if (!duration) {
                return res.status(400).json({ message: 'Duration is required for cardio workouts' });
            }

            // Calculate calories burned for cardio workouts
            caloriesBurned = workoutOption.caloriesBurnedPerMinute * duration;
        } else {
            return res.status(400).json({ message: 'Invalid workout type' });
        }

        // Create the workout log entry
        const workout = new Workout({
            workoutName: workoutOption.workoutName,
            workoutType: workoutOption.workoutType,
            description: workoutOption.description,
            sets,
            reps,
            weightPerSet,
            duration,
            caloriesBurned,
            user: req.user._id,  // Assuming the user is attached to req object
        });

        // Save the workout to the database
        await workout.save();
        res.status(201).json(workout);
    } catch (error) {
        console.error('Error creating workout:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all workouts for the logged-in user
exports.getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user._id });  // Get workouts only for the logged-in user
        res.json(workouts);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getWorkoutByDate = async (req, res) => {
    const { date } = req.params;

    try {
        const normalizedDate = new Date(date).setUTCHours(0,0,0,0);

        const workouts = await Workout.find({
            user: req.user._id,
            createdAt: normalizedDate, 
        });

        const totalCaloriesBurned = workouts.reduce((total, workout) => total + workout.caloriesBurned, 0);

        res.json({
            date: date,
            totalCaloriesBurned,
            workouts // Optional: include the workouts for more context
        });
    } catch (error) {
        console.error('Error fetching workouts by date:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

