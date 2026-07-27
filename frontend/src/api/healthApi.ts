import { apiRequest } from "./apiClient";

export type HealthResponse = {
  status: string;
  message: string;
  version: string;
};

export function getHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>("/health");
}
