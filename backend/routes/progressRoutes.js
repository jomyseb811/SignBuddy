const express = require('express');
const router = express.Router();
const { 
  getUserProgress, 
  updateChapterProgress, 
  getCompletedChapters 
} = require('../controllers/progressController');
const { authenticateToken } = require('../middleware/auth');

// Get user's chapter progress (protected route)
router.get('/', authenticateToken, getUserProgress);

// Update chapter progress (protected route)
router.post('/update', authenticateToken, updateChapterProgress);

// Get completed chapters (protected route)
router.get('/completed', authenticateToken, getCompletedChapters);

module.exports = router;