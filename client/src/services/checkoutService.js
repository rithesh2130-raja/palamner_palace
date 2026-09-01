import { apiClient } from './api/apiClient.js';

export const checkoutService = {
  async getPreview({ addressId, deliveryMethod }) {
    return apiClient.post('/checkout/preview', {
      addressId,
      deliveryMethod,
    });
  },
};

export default checkoutService;
