const express = require('express');
const routes = express.Router();
const {signIn, signUp, activateUser, forgotPassword, resetPassword} = require('../controllers/authController');

// register user route
routes.post('/sign-up', signUp);

// Activate user route
routes.get('/activate/:activationToken', activateUser);

// Login user route
routes.post('/sign-in', signIn);

//Forgot password route
routes.post('/forgot-password', forgotPassword);

// Reset password route
routes.post('/reset-password/:resetToken', resetPassword);

module.exports = routes;