const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, changeUserPassword, deleteUserAccount, getAllUsers, updateUserRole, deactivateUser } = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');

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

// Admin routes (protected and role-restricted)
router.get('/admin/users', authenticateToken, requireRole('admin'), getAllUsers);
router.put('/admin/user-role', authenticateToken, requireRole('admin'), updateUserRole);
router.put('/admin/deactivate-user', authenticateToken, requireRole('admin'), deactivateUser);

module.exports = router;