const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password').populate('goal');
            if (!user) {
                return res.status(404).json({ message: 'User not found. Access denied.' });
            }
            req.user = user;
            next();
        } catch (err) {
            console.error('Token verification failed:', err);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired. Please log in again.' });
            } else {
                return res.status(403).json({ message: 'Access denied. Invalid token.' });
            }
        }
    } else {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
};

module.exports = protect;
