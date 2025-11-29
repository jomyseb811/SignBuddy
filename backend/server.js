const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'SignBuddy API is running!' });
});

// API endpoint to list all color videos
app.get('/api/colors/videos', (req, res) => {
  const colorsDir = path.join(__dirname, 'public', 'signs', 'color');
  
  fs.readdir(colorsDir, (err, files) => {
    if (err) {
      console.error('Error reading colors directory:', err);
      return res.status(500).json({ message: 'Error reading colors directory' });
    }
    
    // Filter only video files and create video objects
    const videos = files
      .filter(file => file.endsWith('.mp4'))
      .map(file => {
        // Extract color name from filename (remove extension)
        const colorName = path.parse(file).name;
        return {
          name: colorName.charAt(0).toUpperCase() + colorName.slice(1), // Capitalize first letter
          videoUrl: `/signs/color/${file}`
        };
      });
    
    res.json(videos);
  });
});

// User routes
app.use('/api/users', require('./routes/userRoutes'));

// Chapter progress routes
app.use('/api/progress', require('./routes/progressRoutes'));

// Dictionary routes
app.use('/api/dictionary', require('./routes/dictionaryRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});