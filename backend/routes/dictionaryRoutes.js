const express = require('express');
const router = express.Router();
const { 
  getAllDictionaryItems, 
  getDictionaryItemsByCategory, 
  searchDictionaryItems, 
  getDictionaryItemById, 
  addDictionaryItem,
  getPendingSigns,
  updateSignStatus
} = require('../controllers/dictionaryController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get all dictionary items
router.get('/', getAllDictionaryItems);

// Get dictionary items by category
router.get('/category/:category', getDictionaryItemsByCategory);

// Search dictionary items
router.get('/search', searchDictionaryItems);

// Get dictionary item by ID
router.get('/:id', getDictionaryItemById);

// Add a new dictionary item (protected route)
router.post('/', authenticateToken, addDictionaryItem);

// Admin/Super User routes (protected and role-restricted)
router.get('/admin/pending', authenticateToken, requireRole('admin', 'super_user'), getPendingSigns);
router.put('/admin/status', authenticateToken, requireRole('admin', 'super_user'), updateSignStatus);

module.exports = router;