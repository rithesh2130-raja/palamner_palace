import { apiClient } from './apiClient.js';

export async function fetchHealthCheck() {
  return apiClient.get('/health');
}
