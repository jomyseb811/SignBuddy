// services/cloudinary.js
import axios from 'axios';

const CLOUD_NAME = process.env.CLOUD_NAME || 'dfpxcglyc';
const API_KEY = process.env.API_KEY || '548318253155317';
const API_SECRET = process.env.API_SECRET || 'sRBg8_7n2N_IhcOLMsiSUcN7_i8';

export const getSignLanguageAssets = async (folderName) => {
  try {
    // Using Cloudinary's Admin API to list resources by prefix
    // This requires authentication but works reliably
    const url = `https://api.cloudinary.com/v1_1/dfpxcglyc/resources/search`;
    
    console.log('Fetching assets from folder:', folderName, API_KEY, API_SECRET, CLOUD_NAME);
    
    const response = await axios.get(url, {
      params: {
        prefix: folderName,
        max_results: 500
      },
      auth: {
        username: API_KEY,
        password: API_SECRET
      }
    });
    
    console.log('Cloudinary response:', response.data);
    
    if (response.data && response.data.resources) {
      return response.data.resources;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching assets:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    // Fallback: Return empty array or suggest manual asset list
    return [];
  }
};