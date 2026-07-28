import { apiRequest } from "./apiClient";
import type { TaskCreateRequest, TaskResponse } from "../types/task";

export function getTasksByProject(projectId: number): Promise<TaskResponse[]> {
  return apiRequest<TaskResponse[]>(`/api/projects/${projectId}/tasks`);
}

export function createTask(
  projectId: number,
  taskData: TaskCreateRequest,
): Promise<TaskResponse> {
  return apiRequest<TaskResponse>(`/api/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(taskData),
  });
}
