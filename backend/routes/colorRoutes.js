const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/videos', (req, res) => {
  try {
    const colorsFolder = path.join(__dirname, '../public/signs/colors');
    
    if (!fs.existsSync(colorsFolder)) {
      return res.status(404).json({ message: 'Colors folder not found' });
    }
    
    const files = fs.readdirSync(colorsFolder);
    
    const videoFiles = files.filter(file => 
      file.endsWith('.mp4') || 
      file.endsWith('.gif') || 
      file.endsWith('.webm')
    );
    
    const videos = videoFiles.map((file, index) => ({
      id: index + 1,
      name: file.replace(/\.(mp4|gif|webm)$/, '').replace(/_/g, ' '),
      videoUrl: `/signs/colors/${file}`
    }));
    
    console.log(`Returning ${videos.length} color videos`);
    res.json(videos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
});

module.exports = router;