import { EXPO_PUBLIC_API_URL } from '@env';
import axios from 'axios';

// Test if the backend server is reachable
export const testServerConnectivity = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const apiUrl = EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await axios.get(`${apiUrl}/`);
    
    if (response.data.message) {
      return {
        success: true,
        message: `Successfully connected to server: ${response.data.message}`
      };
    } else {
      return {
        success: true,
        message: 'Successfully connected to server'
      };
    }
  } catch (error: any) {
    if (error.response) {
      // Server responded with error status
      return {
        success: true,
        message: `Server is reachable but returned status ${error.response.status}`
      };
    } else if (error.request) {
      // Network error (server not reachable)
      return {
        success: false,
        message: `Unable to connect to server at ${EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'}. Please check: 
        1. That the backend server is running
        2. That you're using the correct IP address
        3. Your internet connection
        4. Firewall settings`
      };
    } else {
      // Other error
      return {
        success: false,
        message: `Error testing server connectivity: ${error.message}`
      };
    }
  }
};