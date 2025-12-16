const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import middleware
const updateStreak = require('./middleware/streakTracker');

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

// API endpoint to list all basic color concepts
app.get('/api/colors/basic', (req, res) => {
  const basicColorsDir = path.join(__dirname, 'public', 'signs', 'basic_colors');
  
  fs.readdir(basicColorsDir, (err, files) => {
    if (err) {
      console.error('Error reading basic colors directory:', err);
      return res.status(500).json({ message: 'Error reading basic colors directory' });
    }
    
    // Filter only GIF files and create lesson objects
    const lessons = files
      .filter(file => file.endsWith('.gif'))
      .map(file => {
        // Extract concept name from filename (remove extension and convert underscores to spaces)
        const conceptName = path.parse(file).name.replace(/_/g, ' ');
        // Capitalize first letter of each word
        const formattedName = conceptName.replace(/\b\w/g, l => l.toUpperCase());
        return {
          name: formattedName,
          videoUrl: `/signs/basic_colors/${file}`
        };
      });
    
    res.json(lessons);
  });
});
// Get all signs (alphabets + numbers)
app.get('/api/signs', async (req, res) => {
  try {
    const signs = await mongoose.connection.db
      .collection('signs')
      .find()
      .toArray();
    res.json(signs);
  } catch (error) {
    console.error('Error fetching signs:', error);
    res.status(500).json({ message: 'Error fetching signs', error: error.message });
  }
});

// Get all alphabets only
app.get('/api/signs/alphabets', async (req, res) => {
  try {
    const alphabets = await mongoose.connection.db
      .collection('signs')
      .find({ type: 'alphabet' })
      .sort({ character: 1 })
      .toArray();
    res.json(alphabets);
  } catch (error) {
    console.error('Error fetching alphabets:', error);
    res.status(500).json({ message: 'Error fetching alphabets', error: error.message });
  }
});

// Get all numbers only
app.get('/api/signs/numbers', async (req, res) => {
  try {
    const numbers = await mongoose.connection.db
      .collection('signs')
      .find({ type: 'number' })
      .sort({ character: 1 })
      .toArray();
    res.json(numbers);
  } catch (error) {
    console.error('Error fetching numbers:', error);
    res.status(500).json({ message: 'Error fetching numbers', error: error.message });
  }
});

// Get specific sign by character
app.get('/api/signs/:character', async (req, res) => {
  try {
    const sign = await mongoose.connection.db
      .collection('signs')
      .findOne({ character: req.params.character.toUpperCase() });
    
    if (!sign) {
      return res.status(404).json({ message: 'Sign not found' });
    }
    
    res.json(sign);
  } catch (error) {
    console.error('Error fetching sign:', error);
    res.status(500).json({ message: 'Error fetching sign', error: error.message });
  }
});

// Apply streak tracking middleware to all protected routes
app.use('/api/users', updateStreak, require('./routes/userRoutes'));
app.use('/api/progress', updateStreak, require('./routes/progressRoutes'));
app.use('/api/dictionary', updateStreak, require('./routes/dictionaryRoutes'));

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