const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const goalRoutes = require('./routes/goalRoutes');
const foodItemRoutes = require('./routes/foodItemRoutes');
const workoutOptionRoutes = require('./routes/workoutOptionRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const sleepRoutes = require('./routes/sleepRoutes');
const weightRoutes = require('./routes/weightRoutes');
const waterRoutes = require('./routes/waterRoutes');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error(`MongoDB connection error: ${err}`));

  const corsOptions = {
    origin: 'https://fit-trackpro.netlify.app', // your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // specify allowed methods
    credentials: true, // if you need to include cookies in requests
  };

  app.use(cors(corsOptions));
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/goal', goalRoutes);
app.use('/api/foodItem', foodItemRoutes);
app.use('/api/workoutOption', workoutOptionRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/sleep', sleepRoutes);
app.use("/api/weight", weightRoutes);
app.use("/api/water", waterRoutes);
app.use('/uploads', express.static('public'));


// App listeners
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));