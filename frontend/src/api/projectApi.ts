import { apiRequest } from "./apiClient";
import type {
  ProjectCreateRequest,
  ProjectResponse,
  ProjectUpdateRequest,
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

export function getProjectById(projectId: number): Promise<ProjectResponse> {
  return apiRequest<ProjectResponse>(`/api/projects/${projectId}`);
}

export function updateProject(
  projectId: number,
  projectData: ProjectUpdateRequest,
): Promise<ProjectResponse> {
  return apiRequest<ProjectResponse>(`/api/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(projectData),
  });
}

export function archiveProject(projectId: number): Promise<ProjectResponse> {
  return apiRequest<ProjectResponse>(`/api/projects/${projectId}/archive`, {
    method: "PATCH",
  });
}

export function unarchiveProject(projectId: number): Promise<ProjectResponse> {
  return apiRequest<ProjectResponse>(`/api/projects/${projectId}/unarchive`, {
    method: "PATCH",
  });
}
