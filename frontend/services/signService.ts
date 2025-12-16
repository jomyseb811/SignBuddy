//   deployed backend URL 
const API_URL = 'http://192.168.1.11:3000/api';

export const signService = {
  // Get all signs
  getAllSigns: async () => {
    try {
      const response = await fetch(`${API_URL}/dictionary`);
      if (!response.ok) throw new Error('Failed to fetch signs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching signs:', error);
      throw error;
    }
  },

  // Get alphabets only
  getAlphabets: async () => {
    try {
      const response = await fetch(`${API_URL}/dictionary/category/Alphabets`);
      if (!response.ok) throw new Error('Failed to fetch alphabets');
      return await response.json();
    } catch (error) {
      console.error('Error fetching alphabets:', error);
      throw error;
    }
  },

  // Get numbers only
  getNumbers: async () => {
    try {
      const response = await fetch(`${API_URL}/dictionary/category/Numbers`);
      if (!response.ok) throw new Error('Failed to fetch numbers');
      return await response.json();
    } catch (error) {
      console.error('Error fetching numbers:', error);
      throw error;
    }
  },

  // Get specific sign by word
  getSign: async (word: string) => {
    try {
      const response = await fetch(`${API_URL}/dictionary/search?query=${word}`);
      if (!response.ok) throw new Error('Sign not found');
      const data: any = await response.json();
      // Return the first matching sign if data is an array
      if (Array.isArray(data)) {
        return data.length > 0 ? data[0] : null;
      }
      // If data is not an array, return it directly
      return data;
    } catch (error) {
      console.error('Error fetching sign:', error);
      throw error;
    }
  }
};