import axios from 'axios';
import { getToken } from './auth';

const API_URL = 'http://192.168.1.11:3000/api';

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`${API_URL}/users/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch users');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Update user role (admin only)
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const token = await getToken();
    const response = await axios.put(
      `${API_URL}/users/admin/user-role`,
      { userId, role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update user role');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Deactivate user (admin only)
export const deactivateUser = async (userId: string) => {
  try {
    const token = await getToken();
    const response = await axios.put(
      `${API_URL}/users/admin/deactivate-user`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to deactivate user');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Get pending signs (admin/super_user only)
export const getPendingSigns = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`${API_URL}/dictionary/admin/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch pending signs');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Update sign status (admin/super_user only)
export const updateSignStatus = async (signId: string, status: 'approved' | 'rejected') => {
  try {
    const token = await getToken();
    const response = await axios.put(
      `${API_URL}/dictionary/admin/status`,
      { signId, status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update sign status');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Admin service object
const adminService = {
  getAllUsers,
  updateUserRole,
  deactivateUser,
  getPendingSigns,
  updateSignStatus,
};

export default adminService;