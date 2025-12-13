import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Use environment variable or fallback to localhost
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_URL = `${API_BASE_URL}/users`;

interface RegisterData {
  username: string;
  email: string,
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: UserData;
}

// Register a new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    
    // Store token and user data in AsyncStorage
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    // More detailed error message for network issues
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error') || error.message.includes('ECONNREFUSED')) {
      throw new Error('Unable to connect to the server. Please check your internet connection and ensure the server is running on ' + API_BASE_URL);
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Login user
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    
    // Store token and user data in AsyncStorage
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    // More detailed error message for network issues
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error') || error.message.includes('ECONNREFUSED')) {
      throw new Error('Unable to connect to the server. Please check your internet connection and ensure the server is running on ' + API_BASE_URL);
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch profile');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Logout user
export const logout = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  } catch (error) {
    return false;
  }
};

// Check if user is admin
export const isAdmin = async (): Promise<boolean> => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role === 'admin';
    }
    return false;
  } catch (error) {
    return false;
  }
};

// Get stored token
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    return null;
  }
};

// Get stored user
export const getStoredUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
};

// Add missing functions for profile management
interface UpdateProfileData {
  username: string;
  email: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Update user profile
export const updateProfile = async (data: UpdateProfileData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await axios.put(`${API_URL}/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Update stored user data
    if (response.data.user) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update profile');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Change user password
export const changePassword = async (data: ChangePasswordData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await axios.put(`${API_URL}/change-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to change password');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Delete user account
export const deleteAccount = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await axios.delete(`${API_URL}/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Clear stored data
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete account');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Create default export object with all functions
export default {
  register,
  login,
  getUserProfile,
  logout,
  isAuthenticated,
  isAdmin,
  getToken,
  getStoredUser,
  updateProfile,
  changePassword,
  deleteAccount
};