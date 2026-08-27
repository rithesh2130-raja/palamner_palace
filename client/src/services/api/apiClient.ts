import { env } from "../../config/env";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  public baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
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

  public async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `API Request Failed with status ${response.status}`,
      );
    }

    return response.json();
  }

  public async post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `API Request Failed with status ${response.status}`,
      );
    }

    return response.json();
  }

  public async patch<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `API Request Failed with status ${response.status}`,
      );
    }

    return response.json();
  }

  public async delete<T>(
    path: string,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `API Request Failed with status ${response.status}`,
      );
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(env.VITE_API_URL);
export default apiClient;
