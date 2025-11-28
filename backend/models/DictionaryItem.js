const mongoose = require('mongoose');

const dictionaryItemSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true
  },
  sign: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Greetings', 'People', 'Numbers', 'Alphabets', 'Colors', 'Food', 'Animals', 'Weather']
  },
  cloudinaryUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster searching
dictionaryItemSchema.index({ word: 1, category: 1 });

module.exports = mongoose.model('DictionaryItem', dictionaryItemSchema);