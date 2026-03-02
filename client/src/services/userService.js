// USER SERVICE - Industry Standard API Layer
// Centralized user-related API calls
// Profile management, user data operations

import apiClient from "../api/axiosInstance";

const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (formData) => {
    const response = await apiClient.put("/users/profile", formData);
    return response.data;
  },

  // Update user avatar
  updateAvatar: async (formData) => {
    const response = await apiClient.put("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await apiClient.put(
      "/users/change-password",
      passwordData,
    );
    return response.data;
  },

  // Get user by ID (admin/seller)
  getUserById: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await apiClient.delete("/users/account");
    return response.data;
  },

  // Get user addresses
  getAddresses: async () => {
    const response = await apiClient.get("/users/addresses");
    return response.data;
  },

  // Add address
  addAddress: async (addressData) => {
    const response = await apiClient.post("/users/addresses", addressData);
    return response.data;
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    const response = await apiClient.put(
      `/users/addresses/${addressId}`,
      addressData,
    );
    return response.data;
  },

  // Delete address
  deleteAddress: async (addressId) => {
    const response = await apiClient.delete(`/users/addresses/${addressId}`);
    return response.data;
  },
};

export default userService;
