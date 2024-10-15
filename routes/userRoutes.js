const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const protect = require('../middlewares/auth');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

// Set up multer storage (you can customize where the image is stored and its name)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Set up upload middleware with multer
const uploads = multer({
  storage: storage,
  limits: { fileSize: 10000000 },  // 1MB limit
}).single('profilePicture');

// Get user profile
router.get('/profile', protect, getUserProfile);

// Update user profile with picture upload
router.put('/profile', protect, uploads, updateUserProfile);

module.exports = router;
