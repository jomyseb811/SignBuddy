const mongoose = require('mongoose');

const chapterProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chapterId: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  }
});

// Ensure a user can only have one progress record per chapter
chapterProgressSchema.index({ userId: 1, chapterId: 1 }, { unique: true });

module.exports = mongoose.model('ChapterProgress', chapterProgressSchema);