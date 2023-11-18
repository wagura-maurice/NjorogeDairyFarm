// src/utils/API.tsx
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: 'https://dairy.waguramaurice.com/api/',
  // Additional default settings can be added here
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      // Retrieve the token from storage
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // If token exists, add it to the request headers
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      // Handle error in retrieving token, if necessary
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Perform actions on response data
    return response;
  },
  (error) => {
    // Handle response errors
    return Promise.reject(error);
  }
);

export default api;
