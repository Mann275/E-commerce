// ============================================================================
// AXIOS INSTANCE - INDUSTRY STANDARD APPROACH
// ============================================================================
// This is an industry standard practice that should ideally be done for ALL
// API calls across the entire application for consistency and maintainability.
//
// BENEFITS:
// - Centralized API configuration
// - Automatic token injection in all requests
// - Consistent error handling
// - Easy to modify base URL for different environments
//
// NOTE: In this project, this axios instance is currently used ONLY for
// Cart and Wishlist as examples/reminders of best practices. In a production
// app, all API calls should use a similar configured instance.
// ============================================================================

import axios from "axios";

// Configure instance with base URL and headers
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Important for cookies/sessions
});

// Request interceptor - automatically adds auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle common errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
