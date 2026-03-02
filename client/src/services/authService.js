// ============================================================================
// AUTH SERVICE - Industry Standard API Layer
// ============================================================================
// Centralized authentication API calls
// All authentication-related requests go through this service
// ============================================================================

import apiClient from "../api/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const authService = {
  // Login user
  login: async (formData) => {
    const response = await apiClient.post("/users/login", formData);
    return response.data;
  },

  // Register new user
  register: async (formData) => {
    const response = await apiClient.post("/users/register", formData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await apiClient.post("/users/logout");
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (otp) => {
    const response = await apiClient.post("/users/verify-otp", { otp });
    return response.data;
  },

  // Resend OTP
  resendOTP: async () => {
    const response = await apiClient.post("/users/resend-otp");
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await apiClient.post("/users/forgot-password", { email });
    return response.data;
  },

  // Reset Password
  resetPassword: async (token, password) => {
    const response = await apiClient.post("/users/reset-password", {
      token,
      password,
    });
    return response.data;
  },

  // Verify Email
  verifyEmail: async (token) => {
    const response = await apiClient.get(`/users/verify-email/${token}`);
    return response.data;
  },

  // Refresh Token
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post("/users/refresh-token", {
      refreshToken,
    });
    return response.data;
  },

  // Check Auth Status
  checkAuth: async () => {
    const response = await apiClient.get("/users/check-auth");
    return response.data;
  },
};

export default authService;
