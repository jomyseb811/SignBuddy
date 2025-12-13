const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

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

// Colors route - MUST be before other routes
router.get('/colors/videos', (req, res) => {
  try {
    const colorsFolder = path.join(__dirname, '../public/signs/colors');
    
    // Check if folder exists
    if (!fs.existsSync(colorsFolder)) {
      return res.status(404).json({ message: 'Colors folder not found' });
    }
    
    // Read all files in the folder
    const files = fs.readdirSync(colorsFolder);
    
    // Filter video/gif files
    const videoFiles = files.filter(file => 
      file.endsWith('.mp4') || 
      file.endsWith('.gif') || 
      file.endsWith('.webm') ||
      file.endsWith('.mov')
    );
    
    console.log('Found color files:', videoFiles); // Debug log
    
    // Create response with all videos
    const videos = videoFiles.map((file, index) => ({
      id: index + 1,
      name: file.replace(/\.(mp4|gif|webm|mov)$/, '').replace(/_/g, ' '),
      videoUrl: `/signs/colors/${file}`
    }));
    
    console.log(`Returning ${videos.length} color videos`);
    res.json(videos);
  } catch (error) {
    console.error('Error fetching color videos:', error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
});

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