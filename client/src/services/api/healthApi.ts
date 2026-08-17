import { apiClient } from "./apiClient";

export interface HealthCheckResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    backend: "Connected" | "Offline";
    database: "Connected" | "Disconnected" | "Connecting";
  };
}

export async function fetchHealthCheck(): Promise<HealthCheckResponse> {
  return apiClient.get<HealthCheckResponse>("/health");
}
