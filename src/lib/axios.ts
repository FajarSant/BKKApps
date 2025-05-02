// src/lib/axiosInstance.ts
import axios from 'axios';

// Create an Axios instance with custom configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,  // Make sure to set this in your .env file
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors to handle authentication, errors, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization header if a token exists in localStorage or cookies
    const token = localStorage.getItem('token') || '';  // or get it from cookies/session storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle responses and errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like unauthorized access, etc.
    if (error.response && error.response.status === 401) {
      // Optionally: Handle token expiration or redirection
      // Redirect user to login or show message
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
