const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user).populate('goal');
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { name, age, gender, height, weight, country, activityLevel } = req.body;

        console.log(req.file);

        const user = await User.findById(req.user._id).populate('goal');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        // Update the profile details
        user.name = name || user.name;
        user.age = age || user.age;
        user.gender = gender || user.gender;
        user.height = height || user.height;
        user.weight = weight || user.weight;
        user.country = country || user.country;
        user.activityLevel = activityLevel || user.activityLevel;

        // If a file is uploaded, update the profilePicture field
        if (req.file) {
            user.profilePicture = `/uploads/${req.file.filename}`;
        }

        user.isProfileComplete = true;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
