// CART SERVICE - Industry Standard API Layer
// Centralized cart-related API calls
// Add, remove, update cart items

import apiClient from "../api/axiosInstance";

const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await apiClient.get("/cart");
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await apiClient.post("/cart/add", { productId, quantity });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (productId, quantity) => {
    const response = await apiClient.put("/cart/update", {
      productId,
      quantity,
    });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    const response = await apiClient.post("/cart/remove", { productId });
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await apiClient.delete("/cart/clear");
    return response.data;
  },

  // Apply coupon to cart
  applyCoupon: async (couponCode) => {
    const response = await apiClient.post("/cart/apply-coupon", { couponCode });
    return response.data;
  },

  // Remove coupon from cart
  removeCoupon: async () => {
    const response = await apiClient.delete("/cart/remove-coupon");
    return response.data;
  },

  // Get cart total
  getCartTotal: async () => {
    const response = await apiClient.get("/cart/total");
    return response.data;
  },
};

export default cartService;
