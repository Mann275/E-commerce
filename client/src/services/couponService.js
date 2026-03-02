// ============================================================================
// COUPON SERVICE - Industry Standard API Layer
// ============================================================================
// Centralized coupon-related API calls
// Validate, apply coupons
// ============================================================================

import apiClient from "../api/axiosInstance";

const couponService = {
  // Get all available coupons
  getAvailableCoupons: async () => {
    const response = await apiClient.get("/coupons/available");
    return response.data;
  },

  // Get coupon by code
  getCouponByCode: async (code) => {
    const response = await apiClient.get(`/coupons/${code}`);
    return response.data;
  },

  // Validate coupon
  validateCoupon: async (code) => {
    const response = await apiClient.post("/coupons/validate", { code });
    return response.data;
  },

  // Apply coupon
  applyCoupon: async (code) => {
    const response = await apiClient.post("/coupons/apply", { code });
    return response.data;
  },

  // Get user's used coupons
  getUserCoupons: async () => {
    const response = await apiClient.get("/coupons/my-coupons");
    return response.data;
  },
};

export default couponService;
