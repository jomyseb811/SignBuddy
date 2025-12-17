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
  // Add streak tracking fields
  currentStreak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: null
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
      },
    },
    default: {}
  },

    level:{
 type: String,
enum: ['Beginner','Intermediate','Advanced'],
 default: 'Beginner'
},

signsLearned: {
type: Number,
default: 0
},

 pushNotificationsEnabled: {
type: Boolean,
default: true
},

pushTokens: {
type: [String],
default: []
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);