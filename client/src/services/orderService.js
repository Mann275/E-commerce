// ORDER SERVICE - Industry Standard API Layer
// Centralized order-related API calls
// Create, get, update order status

import apiClient from "../api/axiosInstance";

const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await apiClient.post("/orders/create", orderData);
    return response.data;
  },

  // Get user's orders
  getMyOrders: async () => {
    const response = await apiClient.get("/orders/my-orders");
    return response.data;
  },

  // Get single order by ID
  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    const response = await apiClient.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await apiClient.post(
      "/orders/verify-payment",
      paymentData,
    );
    return response.data;
  },

  // Get order status
  getOrderStatus: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/status`);
    return response.data;
  },

  // Track order
  trackOrder: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/track`);
    return response.data;
  },

  // Request return/refund
  requestReturn: async (orderId, returnData) => {
    const response = await apiClient.post(
      `/orders/${orderId}/return`,
      returnData,
    );
    return response.data;
  },

  // Get seller orders (for sellers)
  getSellerOrders: async () => {
    const response = await apiClient.get("/orders/seller/orders");
    return response.data;
  },

  // Update order status (seller/admin)
  updateOrderStatus: async (orderId, status) => {
    const response = await apiClient.put(`/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  },
};

export default orderService;
