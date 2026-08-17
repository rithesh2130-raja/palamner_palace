export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
  details?: unknown;
}

export type UserRole =
  "Customer" | "Creator" | "Seller" | "Admin" | "SuperAdmin";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface HealthCheckData {
  backend: "Connected" | "Offline";
  database: "Connected" | "Disconnected" | "Connecting";
  uptime?: number;
  memoryUsage?: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
  };
}
