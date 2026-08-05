import { apiRequest } from "./apiClient";
import type {
  TaskCreateRequest,
  TaskResponse,
  TaskUpdateRequest,
} from "../types/task";

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

export function updateTask(
  projectId: number,
  taskId: number,
  taskData: TaskUpdateRequest,
): Promise<TaskResponse> {
  return apiRequest<TaskResponse>(
    `/api/projects/${projectId}/tasks/${taskId}`,
    {
      method: "PATCH",
      body: JSON.stringify(taskData),
    },
  );
}

export function completeTask(
  projectId: number,
  taskId: number,
): Promise<TaskResponse> {
  return apiRequest<TaskResponse>(
    `/api/projects/${projectId}/tasks/${taskId}/complete`,
    {
      method: "PATCH",
    },
  );
}
