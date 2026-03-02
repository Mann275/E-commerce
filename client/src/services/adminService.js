// ADMIN SERVICE - Industry Standard API Layer
// Centralized admin-related API calls
// User management, analytics, system operations

import apiClient from "../api/axiosInstance";

const adminService = {
  // ========== USER MANAGEMENT ==========
  // Get all users
  getAllUsers: async (params = {}) => {
    const response = await apiClient.get("/admin/users", { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Ban/Unban user
  toggleBanUser: async (userId) => {
    const response = await apiClient.put(`/admin/users/${userId}/ban`);
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    const response = await apiClient.put(`/admin/users/${userId}/role`, {
      role,
    });
    return response.data;
  },

  // ========== PRODUCT MANAGEMENT ==========
  // Get all products
  getAllProducts: async (params = {}) => {
    const response = await apiClient.get("/admin/products", { params });
    return response.data;
  },

  // Approve/Reject product (if approval system exists)
  approveProduct: async (productId) => {
    const response = await apiClient.put(
      `/admin/products/${productId}/approve`,
    );
    return response.data;
  },

  // Delete product
  deleteProduct: async (productId) => {
    const response = await apiClient.delete(`/admin/products/${productId}`);
    return response.data;
  },

  // ========== ORDER MANAGEMENT ==========
  // Get all orders
  getAllOrders: async (params = {}) => {
    const response = await apiClient.get("/admin/orders", { params });
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    const response = await apiClient.put(`/admin/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  },

  // Delete order
  deleteOrder: async (orderId) => {
    const response = await apiClient.delete(`/admin/orders/${orderId}`);
    return response.data;
  },

  // ========== ANALYTICS & DASHBOARD ==========
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await apiClient.get("/admin/dashboard/stats");
    return response.data;
  },

  // Get sales analytics
  getSalesAnalytics: async (params = {}) => {
    const response = await apiClient.get("/admin/analytics/sales", { params });
    return response.data;
  },

  // Get user analytics
  getUserAnalytics: async () => {
    const response = await apiClient.get("/admin/analytics/users");
    return response.data;
  },

  // Get product analytics
  getProductAnalytics: async () => {
    const response = await apiClient.get("/admin/analytics/products");
    return response.data;
  },

  // Get revenue analytics
  getRevenueAnalytics: async (params = {}) => {
    const response = await apiClient.get("/admin/analytics/revenue", {
      params,
    });
    return response.data;
  },

  // ========== COUPON MANAGEMENT ==========
  // Get all coupons
  getAllCoupons: async () => {
    const response = await apiClient.get("/admin/coupons");
    return response.data;
  },

  // Create coupon
  createCoupon: async (couponData) => {
    const response = await apiClient.post("/admin/coupons", couponData);
    return response.data;
  },

  // Update coupon
  updateCoupon: async (couponId, couponData) => {
    const response = await apiClient.put(
      `/admin/coupons/${couponId}`,
      couponData,
    );
    return response.data;
  },

  // Delete coupon
  deleteCoupon: async (couponId) => {
    const response = await apiClient.delete(`/admin/coupons/${couponId}`);
    return response.data;
  },

  // ========== SYSTEM MANAGEMENT ==========
  // Get system logs
  getSystemLogs: async (params = {}) => {
    const response = await apiClient.get("/admin/system/logs", { params });
    return response.data;
  },

  // Clear cache
  clearCache: async () => {
    const response = await apiClient.post("/admin/system/clear-cache");
    return response.data;
  },

  // Backup database
  backupDatabase: async () => {
    const response = await apiClient.post("/admin/system/backup");
    return response.data;
  },
};

export default adminService;
