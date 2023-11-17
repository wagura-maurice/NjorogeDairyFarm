// src/utils/api.tsx
import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: 'https://dairy.waguramaurice.com/',
  // You can add more default settings here (like headers)
});

// Optionally, set up interceptors for request and response
api.interceptors.request.use(
  async (config) => {
    // Perform actions before each request is sent
    // e.g., insert authentication tokens into headers
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

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
