const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

// Register new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Protected routes - require authentication
router.get('/profile/:userID', isAuthenticated, authController.getProfile);
router.put('/profile/:userID', isAuthenticated, authController.updateProfile);
router.put('/password/:userID', isAuthenticated, authController.changePassword);

// Admin-only routes
router.get('/users', isAuthenticated, authController.getAllUsers);
router.delete('/users/:userId', isAuthenticated, authController.deleteUser);

// Check if identifier exists (for validation during registration)
router.get('/check', authController.checkIdentifier);

module.exports = router;
