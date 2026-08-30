import { env } from '../../config/env.js';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  buildUrl(path, params) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${cleanPath}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('shopsphere_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async get(path, options) {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || errorData.error?.message || `API Request Failed with status ${response.status}`);
      err.code = errorData.code || errorData.error?.code;
      throw err;
    }

    return response.json();
  }

  async post(path, body, options) {
    const url = this.buildUrl(path, options?.params);
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    const headers = { ...this.getAuthHeaders(), ...options?.headers };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || errorData.error?.message || `API Request Failed with status ${response.status}`);
      err.code = errorData.code || errorData.error?.code;
      throw err;
    }

    return response.json();
  }

  async patch(path, body, options) {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || errorData.error?.message || `API Request Failed with status ${response.status}`);
      err.code = errorData.code || errorData.error?.code;
      throw err;
    }

    return response.json();
  }

  async delete(path, options) {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || errorData.error?.message || `API Request Failed with status ${response.status}`);
      err.code = errorData.code || errorData.error?.code;
      throw err;
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(env.VITE_API_URL || 'http://localhost:5000/api/v1');
