import type { DashboardSummary } from "../types/dashboard";
import type {
  ProjectCreateRequest,
  ProjectResponse,
  ProjectUpdateRequest,
} from "../types/project";
import type {
  TaskCreateRequest,
  TaskResponse,
  TaskUpdateRequest,
} from "../types/task";
import { DEMO_USER } from "./demoData";
import type { DemoMutation, DemoState } from "./demoTypes";

function nextId(records: readonly { id: number }[]): number {
  return records.reduce((largestId, record) => Math.max(largestId, record.id), 0) + 1;
}

function getProjectOrThrow(state: DemoState, projectId: number): ProjectResponse {
  const project = state.projects.find((candidate) => candidate.id === projectId);

  if (!project) {
    throw new Error("Project not found.");
  }

  return project;
}

function ensureProjectIsEditable(project: ProjectResponse): void {
  if (project.is_archived) {
    throw new Error("Archived Projects are read-only.");
  }
}

export function calculateDemoSummary(state: DemoState): DashboardSummary {
  return {
    total_projects: state.projects.length,
    planned_projects: state.projects.filter((project) => project.status === "planned").length,
    active_projects: state.projects.filter((project) => project.status === "active").length,
    completed_projects: state.projects.filter((project) => project.status === "completed").length,
    archived_projects: state.projects.filter((project) => project.is_archived).length,
    total_budget: state.projects.reduce((total, project) => total + project.budget, 0),
    total_tasks: state.tasks.length,
    todo_tasks: state.tasks.filter((task) => task.status === "todo").length,
    in_progress_tasks: state.tasks.filter((task) => task.status === "in_progress").length,
    done_tasks: state.tasks.filter((task) => task.status === "done").length,
  };
}

export function createDemoProject(
  state: DemoState,
  projectData: ProjectCreateRequest,
): DemoMutation<ProjectResponse> {
  const project: ProjectResponse = {
    id: nextId(state.projects),
    name: projectData.name,
    description: projectData.description ?? null,
    client_name: projectData.client_name ?? null,
    status: projectData.status ?? "planned",
    budget: projectData.budget ?? 0,
    start_date: projectData.start_date ?? null,
    deadline: projectData.deadline ?? null,
    owner_id: DEMO_USER.id,
    is_archived: false,
    created_at: new Date().toISOString(),
  };

  return {
    state: {
      ...state,
      projects: [project, ...state.projects],
    },
    value: project,
  };
}

export function updateDemoProject(
  state: DemoState,
  projectId: number,
  projectData: ProjectUpdateRequest,
): DemoMutation<ProjectResponse> {
  const existingProject = getProjectOrThrow(state, projectId);
  ensureProjectIsEditable(existingProject);

  const project: ProjectResponse = {
    ...existingProject,
    ...projectData,
    name: projectData.name ?? existingProject.name,
    status: projectData.status ?? existingProject.status,
    budget: projectData.budget ?? existingProject.budget,
  };

  return {
    state: {
      ...state,
      projects: state.projects.map((candidate) =>
        candidate.id === projectId ? project : candidate,
      ),
    },
    value: project,
  };
}

export function setDemoProjectArchived(
  state: DemoState,
  projectId: number,
  isArchived: boolean,
): DemoMutation<ProjectResponse> {
  const existingProject = getProjectOrThrow(state, projectId);
  const project = { ...existingProject, is_archived: isArchived };

  return {
    state: {
      ...state,
      projects: state.projects.map((candidate) =>
        candidate.id === projectId ? project : candidate,
      ),
    },
    value: project,
  };
}

export function createDemoTask(
  state: DemoState,
  projectId: number,
  taskData: TaskCreateRequest,
): DemoMutation<TaskResponse> {
  const project = getProjectOrThrow(state, projectId);
  ensureProjectIsEditable(project);

  const timestamp = new Date().toISOString();
  const task: TaskResponse = {
    id: nextId(state.tasks),
    title: taskData.title,
    description: taskData.description ?? null,
    status: taskData.status ?? "todo",
    priority: taskData.priority ?? "medium",
    due_date: taskData.due_date ?? null,
    project_id: projectId,
    created_at: timestamp,
    updated_at: timestamp,
  };

  return {
    state: {
      ...state,
      tasks: [task, ...state.tasks],
    },
    value: task,
  };
}

export function updateDemoTask(
  state: DemoState,
  projectId: number,
  taskId: number,
  taskData: TaskUpdateRequest,
): DemoMutation<TaskResponse> {
  const project = getProjectOrThrow(state, projectId);
  ensureProjectIsEditable(project);

  const existingTask = state.tasks.find(
    (candidate) => candidate.id === taskId && candidate.project_id === projectId,
  );

  if (!existingTask) {
    throw new Error("Task not found.");
  }

  const task: TaskResponse = {
    ...existingTask,
    ...taskData,
    title: taskData.title ?? existingTask.title,
    status: taskData.status ?? existingTask.status,
    priority: taskData.priority ?? existingTask.priority,
    updated_at: new Date().toISOString(),
  };

  return {
    state: {
      ...state,
      tasks: state.tasks.map((candidate) =>
        candidate.id === taskId && candidate.project_id === projectId
          ? task
          : candidate,
      ),
    },
    value: task,
  };
}

export function completeDemoTask(
  state: DemoState,
  projectId: number,
  taskId: number,
): DemoMutation<TaskResponse> {
  return updateDemoTask(state, projectId, taskId, { status: "done" });
}
