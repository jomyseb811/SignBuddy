const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with default role and initialize streak fields
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user', 
      currentStreak: 0, 
      signsLearned: 0, 
      level:'Beginner',
      lastActivityDate: null,
      notificationsEnabled: true,
    });

    const savedUser = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
        streak: savedUser.currentStreak || 0 ,
        signsLearned: savedUser.signsLearned || 0,
        level: savedUser.level,
        lastActivityDate: savedUser.lastActivityDate,
        notificationsEnabled: savedUser.notificationsEnabled
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is deactivated
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account has been deactivated' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Initialize streak for new users (first login)
    if (user.currentStreak === 0 && user.lastActivityDate === null) {
      user.currentStreak = 1;
      user.lastActivityDate = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        streak: user.currentStreak || 0 ,
        signsLearned: user.signsLearned || 0,
        level: user.level,
        lastActivityDate: user.lastActivityDate,
        notificationsEnabled: user.notificationsEnabled
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user profile with streak information
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      streak: user.currentStreak || 0,
      createdAt: user.createdAt,
      signsLearned: user.signsLearned || 0,
      level: user.level,
      lastActivityDate: user.lastActivityDate,
      notificationsEnabled: true,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.userId;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email or username is already taken by another user
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

    if (username && username !== existingUser.username) {
      const usernameExists = await User.findOne({ username, _id: { $ne: userId } });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Change user password
const changeUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};

// Delete user account
const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Error deleting account' });
  }
};

// Admin: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Admin: Update user role
const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    // Validate role
    const validRoles = ['user', 'verified_user', 'super_user', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Prevent removing admin role from self
    if (userId === req.user.userId && role !== 'admin') {
      return res.status(400).json({ message: 'Cannot remove admin role from yourself' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
};

// Admin: Deactivate user
const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Prevent deactivating self
    if (userId === req.user.userId) {
      return res.status(400).json({ message: 'Cannot deactivate yourself' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User deactivated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ message: 'Error deactivating user' });
  }
};

// Toggle push notifications
const togglePushNotifications = async (req, res) => {
  try {
    const { enabled } = req.body;
    
    await User.findByIdAndUpdate(req.user.userId, {
      pushNotificationsEnabled: enabled
    });
    
    res.json({ 
      message: 'Push notification preference updated',
      enabled 
    });
  } catch (error) {
    console.error('Toggle push notifications error:', error);
    res.status(500).json({ message: 'Failed to update preference' });
  }
};

// Save push token
const savePushToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    
    // Add token if not already exists (prevent duplicates)
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { pushTokens: token }
    });
    
    res.json({ 
      message: 'Push token saved',
      token 
    });
  } catch (error) {
    console.error('Save push token error:', error);
    res.status(500).json({ message: 'Failed to save token' });
  }
};

// Remove push token
const removePushToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { pushTokens: token }
    });
    
    res.json({ 
      message: 'Push token removed',
      token 
    });
  } catch (error) {
    console.error('Remove push token error:', error);
    res.status(500).json({ message: 'Failed to remove token' });
  }
};
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUserAccount,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  togglePushNotifications,
  savePushToken,
  removePushToken
};