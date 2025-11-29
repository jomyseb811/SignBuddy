const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  // Add role field with default value
  role: {
    type: String,
    enum: ['user', 'verified_user', 'super_user', 'admin'],
    default: 'user'
  },
  // Add isActive field for user deactivation
  isActive: {
    type: Boolean,
    default: true
  },
  progress: {
    type: Map,
    of: {
      completed: {
        type: Boolean,
        default: false
      },
      score: {
        type: Number,
        default: 0
      }
    },
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);