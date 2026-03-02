// WISHLIST SERVICE - Industry Standard API Layer
// Centralized wishlist-related API calls
// Add, remove, get wishlist items

import apiClient from "../api/axiosInstance";

const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    const response = await apiClient.get("/wishlist");
    return response.data;
  },

  // Add item to wishlist
  addToWishlist: async (productId) => {
    const response = await apiClient.post("/wishlist/add", { productId });
    return response.data;
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId) => {
    const response = await apiClient.post("/wishlist/remove", { productId });
    return response.data;
  },

  // Clear entire wishlist
  clearWishlist: async () => {
    const response = await apiClient.delete("/wishlist/clear");
    return response.data;
  },

  // Check if product is in wishlist
  isInWishlist: async (productId) => {
    const response = await apiClient.get(`/wishlist/check/${productId}`);
    return response.data;
  },

  // Move all wishlist items to cart
  moveAllToCart: async () => {
    const response = await apiClient.post("/wishlist/move-to-cart");
    return response.data;
  },
};

export default wishlistService;
