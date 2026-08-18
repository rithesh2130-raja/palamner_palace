import { apiClient } from './apiClient.js';
import { MOCK_NOTIFICATIONS } from '../../constants/mockNotifications.js';

export const notificationService = {
  async getNotifications() {
    try {
      const data = await apiClient.get('/notifications');
      return data?.data || MOCK_NOTIFICATIONS;
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  }
};
