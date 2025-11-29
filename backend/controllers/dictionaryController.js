const DictionaryItem = require('../models/DictionaryItem');
const User = require('../models/User');

// Get all dictionary items
const getAllDictionaryItems = async (req, res) => {
  try {
    const items = await DictionaryItem.find().sort({ word: 1 });
    res.json(items);
  } catch (error) {
    console.error('Get dictionary items error:', error);
    res.status(500).json({ message: 'Error fetching dictionary items' });
  }
};

// Get dictionary items by category
const getDictionaryItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    // Only return approved items
    const items = await DictionaryItem.find({ category, status: 'approved' }).sort({ word: 1 });
    res.json(items);
  } catch (error) {
    console.error('Get dictionary items by category error:', error);
    res.status(500).json({ message: 'Error fetching dictionary items by category' });
  }
};

// Search dictionary items
const searchDictionaryItems = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Only return approved items
    const items = await DictionaryItem.find({
      word: { $regex: query, $options: 'i' },
      status: 'approved'
    }).sort({ word: 1 });
    
    res.json(items);
  } catch (error) {
    console.error('Search dictionary items error:', error);
    res.status(500).json({ message: 'Error searching dictionary items' });
  }
};

// Get dictionary item by ID
const getDictionaryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    // Only return approved items
    const item = await DictionaryItem.findById(id).populate('uploadedBy', 'username');
    
    if (!item) {
      return res.status(404).json({ message: 'Dictionary item not found' });
    }
    
    // Only return approved items to regular users
    if (item.status !== 'approved') {
      return res.status(404).json({ message: 'Dictionary item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Get dictionary item error:', error);
    res.status(500).json({ message: 'Error fetching dictionary item' });
  }
};

// Add a new dictionary item
const addDictionaryItem = async (req, res) => {
  try {
    const { word, sign, category, cloudinaryUrl } = req.body;
    
    // Get user from token
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Set status based on user role
    let status = 'pending';
    if (user.role === 'verified_user' || user.role === 'admin') {
      status = 'approved'; // Auto-approve for verified users and admins
    }
    
    const newItem = new DictionaryItem({
      word,
      sign,
      category,
      cloudinaryUrl,
      status,
      uploadedBy: userId
    });
    
    const savedItem = await newItem.save();
    
    // Populate uploadedBy field for response
    await savedItem.populate('uploadedBy', 'username role');
    
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Add dictionary item error:', error);
    res.status(500).json({ message: 'Error adding dictionary item' });
  }
};

// Admin/Super User: Get pending signs for review
const getPendingSigns = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    // Only admin and super_user can access this
    if (user.role !== 'admin' && user.role !== 'super_user') {
      return res.status(403).json({ message: 'Access denied. Admin or Super User only.' });
    }
    
    const pendingItems = await DictionaryItem.find({ status: 'pending' })
      .populate('uploadedBy', 'username role')
      .sort({ createdAt: -1 });
      
    res.json(pendingItems);
  } catch (error) {
    console.error('Get pending signs error:', error);
    res.status(500).json({ message: 'Error fetching pending signs' });
  }
};

// Admin/Super User: Update sign status
const updateSignStatus = async (req, res) => {
  try {
    const { signId, status } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    // Only admin and super_user can update sign status
    if (user.role !== 'admin' && user.role !== 'super_user') {
      return res.status(403).json({ message: 'Access denied. Admin or Super User only.' });
    }
    
    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const updatedItem = await DictionaryItem.findByIdAndUpdate(
      signId,
      { status },
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'username role');
    
    if (!updatedItem) {
      return res.status(404).json({ message: 'Sign not found' });
    }
    
    res.json({
      message: `Sign ${status} successfully`,
      item: updatedItem
    });
  } catch (error) {
    console.error('Update sign status error:', error);
    res.status(500).json({ message: 'Error updating sign status' });
  }
};

module.exports = {
  getAllDictionaryItems,
  getDictionaryItemsByCategory,
  searchDictionaryItems,
  getDictionaryItemById,
  addDictionaryItem,
  getPendingSigns,
  updateSignStatus
};