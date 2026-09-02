import { apiClient } from './apiClient.js';
import { MOCK_REELS } from '../../constants/mockReels.js';

export const reelService = {
  async getReels(params) {
    try {
      const res = await apiClient.get('/reels', { params });
      return res?.data || MOCK_REELS;
    } catch {
      return MOCK_REELS;
    }
  },

  async getReel(id) {
    try {
      const res = await apiClient.get(`/reels/${id}`);
      return res?.data;
    } catch {
      return MOCK_REELS.find((r) => r.id === id || r._id === id);
    }
  },

  async toggleLike(id) {
    return apiClient.post(`/reels/${id}/like`);
  },

  async toggleSave(id) {
    return apiClient.post(`/reels/${id}/save`);
  },

  async addComment(id, text) {
    return apiClient.post(`/reels/${id}/comments`, { text });
  },

  async recordView(id) {
    return apiClient.post(`/reels/${id}/view`).catch(() => {});
  },
};

export default reelService;
