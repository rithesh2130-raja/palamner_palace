import { apiClient } from './api/apiClient.js';

export const addressService = {
  async getAddresses() {
    return apiClient.get('/addresses');
  },

  async createAddress(addressData) {
    return apiClient.post('/addresses', addressData);
  },

  async updateAddress(id, addressData) {
    return apiClient.patch(`/addresses/${id}`, addressData);
  },

  async deleteAddress(id) {
    return apiClient.delete(`/addresses/${id}`);
  },

  async setDefaultAddress(id) {
    return apiClient.post(`/addresses/${id}/default`);
  },
};

export default addressService;
