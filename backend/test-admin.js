// Simple test script to verify admin functionality
const mongoose = require('mongoose');
const User = require('./models/User');
const DictionaryItem = require('./models/DictionaryItem');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/signbuddy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // Create a test admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@test.com',
      password: 'admin123', // In real app, this would be hashed
      role: 'admin'
    });

    await adminUser.save();
    console.log('Created admin user:', adminUser.username);

    // Create a test verified user
    const verifiedUser = new User({
      username: 'verified',
      email: 'verified@test.com',
      password: 'verified123', // In real app, this would be hashed
      role: 'verified_user'
    });

    await verifiedUser.save();
    console.log('Created verified user:', verifiedUser.username);

    // Create a test regular user
    const regularUser = new User({
      username: 'user',
      email: 'user@test.com',
      password: 'user123', // In real app, this would be hashed
      role: 'user'
    });

    await regularUser.save();
    console.log('Created regular user:', regularUser.username);

    // Create a test sign
    const testSign = new DictionaryItem({
      word: 'Test',
      sign: 'Test Sign',
      category: 'Greetings',
      status: 'pending',
      uploadedBy: regularUser._id
    });

    await testSign.save();
    console.log('Created test sign:', testSign.word);

    // Create an auto-approved sign from verified user
    const verifiedSign = new DictionaryItem({
      word: 'Verified',
      sign: 'Verified Sign',
      category: 'Greetings',
      status: 'approved', // Auto-approved for verified users
      uploadedBy: verifiedUser._id
    });

    await verifiedSign.save();
    console.log('Created verified sign (auto-approved):', verifiedSign.word);

    console.log('Test data created successfully!');
    console.log('You can now test the admin panel functionality.');

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    mongoose.connection.close();
  }
});