// src/utils/API.tsx
import axios from "axios";
import Config from 'react-native-config'; // Import Config from react-native-config
import { getData } from "./Storage"; // Assume this securely retrieves the token

// Create an Axios instance with the base URL from the environment variable
const api = axios.create({
  baseURL: "http://dairy.waguramaurice.com/api", // Config.REACT_APP_API_URL, // Use the environment variable
  timeout: 10000, // Sets a timeout of 10 seconds for all requests
  headers: {
    'Content-Type': 'application/json', // Sets default content type for all requests
  },
});

// Request Interceptor to Add Authorization Header
api.interceptors.request.use(
  async (config) => {
    try {
      // Securely retrieve the token from storage
      const token = await getData("userToken");

      if (token) {
        // If token exists, add it to the request headers
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      // Handle error in retrieving token, if necessary
      console.error("Error in request interceptor:", error);
      return config;
    }
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response Interceptor for Centralized Error Handling
api.interceptors.response.use(
  (response) => {
    // Any global response handling would go here
    return response;
  },
  (error) => {
    // Handle response errors globally
    if (error.response && error.response.status === 401) {
      // Specific error handling for unauthorized access
      // Consider triggering a token refresh or user logout here
    }
    return Promise.reject(error);
  }
);

export default api;
