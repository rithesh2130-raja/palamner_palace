import { apiClient } from './apiClient.js';
import { MOCK_REELS } from '../../constants/mockReels.js';

export const reelService = {
  async getReels() {
    try {
      const data = await apiClient.get('/reels');
      return data?.data || MOCK_REELS;
    } catch {
      return MOCK_REELS;
    }
  }
};
