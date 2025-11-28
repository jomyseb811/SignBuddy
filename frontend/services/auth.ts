import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = `${process.env.API_URL || 'http://192.168.1.11:3000/api'}/users`;

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

// Register a new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    
    // Store token in AsyncStorage
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Login user
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    
    // Store token in AsyncStorage
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
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

// Update user profile
export const updateProfile = async (data: { username: string; email: string }) => {
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

// Change password
export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
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

// Delete account
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

export default {
  register,
  login,
  getUserProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  logout,
  isAuthenticated,
  getToken,
  getStoredUser
}