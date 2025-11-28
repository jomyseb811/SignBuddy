const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, changeUserPassword, deleteUserAccount } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile (protected route)
router.get('/profile', authenticateToken, getUserProfile);

// Update user profile (protected route)
router.put('/profile', authenticateToken, updateUserProfile);

// Change user password (protected route)
router.put('/change-password', authenticateToken, changeUserPassword);

// Delete user account (protected route)
router.delete('/account', authenticateToken, deleteUserAccount);

module.exports = router;