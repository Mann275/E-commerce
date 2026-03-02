// PRODUCT SERVICE - Industry Standard API Layer
// Centralized product-related API calls
// CRUD operations, filtering, searching

import apiClient from "../api/axiosInstance";

const productService = {
  // Get all products with filters
  getAllProducts: async (params = {}) => {
    const response = await apiClient.get("/products", { params });
    return response.data;
  },

  // Get single product by ID
  getProductById: async (productId) => {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    const response = await apiClient.get(`/products/category/${category}`, {
      params,
    });
    return response.data;
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const response = await apiClient.get("/products/search", {
      params: { q: query, ...params },
    });
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await apiClient.get("/products/featured");
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (productId) => {
    const response = await apiClient.get(`/products/${productId}/related`);
    return response.data;
  },

  // Create product (seller/admin)
  createProduct: async (formData) => {
    const response = await apiClient.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update product (seller/admin)
  updateProduct: async (productId, formData) => {
    const response = await apiClient.put(`/products/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete product (seller/admin)
  deleteProduct: async (productId) => {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
  },

  // Get seller products
  getSellerProducts: async () => {
    const response = await apiClient.get("/products/seller/my-products");
    return response.data;
  },

  // Add product review
  addReview: async (productId, reviewData) => {
    const response = await apiClient.post(
      `/products/${productId}/reviews`,
      reviewData,
    );
    return response.data;
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    const response = await apiClient.get(`/products/${productId}/reviews`);
    return response.data;
  },

  // Update product stock (seller/admin)
  updateStock: async (productId, stock) => {
    const response = await apiClient.patch(`/products/${productId}/stock`, {
      stock,
    });
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await apiClient.get("/products/categories");
    return response.data;
  },
};

export default productService;
