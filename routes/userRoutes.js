const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const protect = require('../middlewares/auth');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

const storagePath = '/opt/render/project/public';

if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storagePath); 
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
