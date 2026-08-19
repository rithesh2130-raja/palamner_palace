import { apiClient } from './apiClient.js';

export const advertisementService = {
  async getHealth() {
    try {
      const data = await apiClient.get('/advertisements/health');
      return data;
    } catch {
      return { geminiConfigured: false, model: 'gemini-omni-flash-preview', uploadDirectoryExists: true };
    }
  },

  async getAdvertisements() {
    try {
      const data = await apiClient.get('/advertisements');
      return data?.data || data?.advertisements || [];
    } catch {
      return [];
    }
  },

  async getAdvertisementById(id) {
    try {
      const data = await apiClient.get(`/advertisements/${id}`);
      return data?.data || data?.advertisement || null;
    } catch {
      return null;
    }
  },

  async generateAdvertisement(params) {
    // If params is FormData, pass directly so browser sets boundary
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
