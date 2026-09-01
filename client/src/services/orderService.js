import { apiClient } from './api/apiClient.js';

export const orderService = {
  async placeOrder({ addressId, deliveryMethod, paymentMethod, idempotencyKey }) {
    const headers = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    return apiClient.post(
      '/orders',
      {
        addressId,
        deliveryMethod,
        paymentMethod,
        idempotencyKey,
      },
      { headers }
    );
  },

  async getOrders(params) {
    return apiClient.get('/orders', { params });
  },

  async getOrder(orderId) {
    return apiClient.get(`/orders/${orderId}`);
  },

  async cancelOrder(orderId, note) {
    return apiClient.post(`/orders/${orderId}/cancel`, { note });
  },

  // Admin APIs
  async getAdminOrders(params) {
    return apiClient.get('/orders/admin/all', { params });
  },

  async updateOrderStatusAdmin(orderId, status, note) {
    return apiClient.patch(`/orders/admin/${orderId}/status`, { status, note });
  },
};

export default orderService;
