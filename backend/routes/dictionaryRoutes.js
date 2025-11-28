const express = require('express');
const router = express.Router();
const { 
  getAllDictionaryItems,
  getDictionaryItemsByCategory,
  searchDictionaryItems,
  getDictionaryItemById,
  addDictionaryItem
} = require('../controllers/dictionaryController');
const { authenticateToken } = require('../middleware/auth');

// Get all dictionary items
router.get('/', getAllDictionaryItems);

// Get dictionary items by category
router.get('/category/:category', getDictionaryItemsByCategory);

// Search dictionary items
router.get('/search', searchDictionaryItems);

// Get dictionary item by ID
router.get('/:id', getDictionaryItemById);

// Add a new dictionary item (protected route - admin only)
router.post('/add', authenticateToken, addDictionaryItem);

module.exports = router;