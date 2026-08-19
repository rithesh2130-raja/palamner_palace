import { apiClient } from './apiClient.js';

export const advertisementService = {
  async getAdvertisements() {
    try {
      const data = await apiClient.get('/advertisements');
      return data?.data || [];
    } catch {
      return [];
    }
  },

  async getAdvertisementById(id) {
    try {
      const data = await apiClient.get(`/advertisements/${id}`);
      return data?.data || null;
    } catch {
      return null;
    }
  },

  async generateAdvertisement(params) {
    const data = await apiClient.post('/advertisements/generate', params);
    return data;
  },

  async editAdvertisement(id, editInstruction) {
    const data = await apiClient.post(`/advertisements/${id}/edit`, { editInstruction });
    return data;
  },

  async publishAdvertisementAsReel(id) {
    const data = await apiClient.post(`/advertisements/${id}/publish`);
    return data;
  }
};
