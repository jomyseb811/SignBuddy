const ChapterProgress = require('../models/ChapterProgress');

// Get user's chapter progress
const getUserProgress = async (req, res) => {
  try {
    const progress = await ChapterProgress.find({ userId: req.user.userId });
    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Error fetching progress' });
  }
};

// Update chapter progress
const updateChapterProgress = async (req, res) => {
  try {
    const { chapterId, completed, score } = req.body;
    const userId = req.user.userId;

    // Validate chapterId
    if (!chapterId || chapterId <= 0) {
      return res.status(400).json({ message: 'Invalid chapter ID' });
    }

    // Find or create progress record
    let progress = await ChapterProgress.findOne({ userId, chapterId });

    if (!progress) {
      progress = new ChapterProgress({
        userId,
        chapterId,
        completed: completed || false,
        score: score || 0
      });
    } else {
      // Update existing progress
      if (completed !== undefined) progress.completed = completed;
      if (score !== undefined) progress.score = score;
      if (completed && !progress.completedAt) {
        progress.completedAt = new Date();
      }
    }

    const savedProgress = await progress.save();
    res.json(savedProgress);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Error updating progress' });
  }
};

// Get completed chapters
const getCompletedChapters = async (req, res) => {
  try {
    const completed = await ChapterProgress.find({ 
      userId: req.user.userId, 
      completed: true 
    }).select('chapterId');
    
    const chapterIds = completed.map(item => item.chapterId);
    res.json(chapterIds);
  } catch (error) {
    console.error('Get completed chapters error:', error);
    res.status(500).json({ message: 'Error fetching completed chapters' });
  }
};

module.exports = {
  getUserProgress,
  updateChapterProgress,
  getCompletedChapters
};