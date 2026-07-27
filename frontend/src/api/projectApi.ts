import { apiRequest } from "./apiClient";
import type {
  ProjectCreateRequest,
  ProjectResponse,
} from "../types/project";

export function getProjects(
  includeArchived?: boolean,
): Promise<ProjectResponse[]> {
  const searchParams = new URLSearchParams();

  if (includeArchived !== undefined) {
    searchParams.set("include_archived", String(includeArchived));
  }

  const query = searchParams.size > 0 ? `?${searchParams.toString()}` : "";
  return apiRequest<ProjectResponse[]>(`/api/projects${query}`);
}

export function createProject(
  projectData: ProjectCreateRequest,
): Promise<ProjectResponse> {
  return apiRequest<ProjectResponse>("/api/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}
