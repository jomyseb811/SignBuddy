const DictionaryItem = require('../models/DictionaryItem');

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
    const items = await DictionaryItem.find({ category }).sort({ word: 1 });
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
    
    const items = await DictionaryItem.find({
      word: { $regex: query, $options: 'i' }
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
    const item = await DictionaryItem.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Dictionary item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Get dictionary item error:', error);
    res.status(500).json({ message: 'Error fetching dictionary item' });
  }
};

// Add a new dictionary item (for admin use)
const addDictionaryItem = async (req, res) => {
  try {
    const { word, sign, category, cloudinaryUrl } = req.body;
    
    const newItem = new DictionaryItem({
      word,
      sign,
      category,
      cloudinaryUrl
    });
    
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Add dictionary item error:', error);
    res.status(500).json({ message: 'Error adding dictionary item' });
  }
};

module.exports = {
  getAllDictionaryItems,
  getDictionaryItemsByCategory,
  searchDictionaryItems,
  getDictionaryItemById,
  addDictionaryItem
};