const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Get user profile
router.get('/profile/:userID', authController.getProfile);

// Update user profile
router.put('/profile/:userID', authController.updateProfile);

// Change password
router.put('/password/:userID', authController.changePassword);

// Check if identifier exists (for validation during registration)
router.get('/check', authController.checkIdentifier);

module.exports = router;
