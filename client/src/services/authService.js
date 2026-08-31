import { apiClient } from './api/apiClient.js';

export const authService = {
  async register(data) {
    const res = await apiClient.post('/auth/register', data);
    if (res?.data?.token) {
      localStorage.setItem('shopsphere_token', res.data.token);
    }
    return res;
  },

  async login(data) {
    const res = await apiClient.post('/auth/login', data);
    if (res?.data?.token) {
      localStorage.setItem('shopsphere_token', res.data.token);
    }
    return res;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('shopsphere_token');
    }
  },

  async getMe() {
    return apiClient.get('/auth/me');
  },

  async updateProfile(data) {
    return apiClient.patch('/users/me', data);
  },

  async forgotPassword(email) {
    return apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token, newPassword) {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  },

  async changePassword(data) {
    return apiClient.post('/auth/change-password', data);
  },
};

export default authService;
