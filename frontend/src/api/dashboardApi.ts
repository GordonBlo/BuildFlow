import { apiRequest } from "./apiClient";
import type { DashboardSummary } from "../types/dashboard";

export function getDashboardSummary(): Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>("/api/dashboard/summary");
}
