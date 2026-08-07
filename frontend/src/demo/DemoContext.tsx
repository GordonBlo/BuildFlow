import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

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
import {
  loadDemoState,
  restoreSeedDemoState,
  saveDemoState,
} from "./demoRepository";
import {
  calculateDemoSummary,
  completeDemoTask,
  createDemoProject,
  createDemoTask,
  setDemoProjectArchived,
  updateDemoProject,
  updateDemoTask,
} from "./demoService";
import type { DemoMutation, DemoState, DemoUser } from "./demoTypes";

type DemoContextValue = {
  currentUser: DemoUser;
  projects: ProjectResponse[];
  tasks: TaskResponse[];
  summary: DashboardSummary;
  getProject: (projectId: number) => ProjectResponse | null;
  getProjectTasks: (projectId: number) => TaskResponse[];
  createProject: (projectData: ProjectCreateRequest) => Promise<ProjectResponse>;
  updateProject: (
    projectId: number,
    projectData: ProjectUpdateRequest,
  ) => Promise<ProjectResponse>;
  archiveProject: (projectId: number) => Promise<ProjectResponse>;
  unarchiveProject: (projectId: number) => Promise<ProjectResponse>;
  createTask: (
    projectId: number,
    taskData: TaskCreateRequest,
  ) => Promise<TaskResponse>;
  updateTask: (
    projectId: number,
    taskId: number,
    taskData: TaskUpdateRequest,
  ) => Promise<TaskResponse>;
  completeTask: (projectId: number, taskId: number) => Promise<TaskResponse>;
  resetDemoData: () => void;
};

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

export function DemoProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<DemoState>(loadDemoState);
  const stateRef = useRef(state);

  const commitMutation = useCallback(<T,>(mutation: DemoMutation<T>): T => {
    stateRef.current = mutation.state;
    setState(mutation.state);
    saveDemoState(mutation.state);
    return mutation.value;
  }, []);

  const getProject = useCallback((projectId: number) => {
    return (
      stateRef.current.projects.find((project) => project.id === projectId) ??
      null
    );
  }, []);

  const getProjectTasks = useCallback((projectId: number) => {
    return stateRef.current.tasks
      .filter((task) => task.project_id === projectId)
      .sort((first, second) =>
        second.created_at.localeCompare(first.created_at),
      );
  }, []);

  const createProject = useCallback(
    async (projectData: ProjectCreateRequest) =>
      commitMutation(createDemoProject(stateRef.current, projectData)),
    [commitMutation],
  );

  const updateProject = useCallback(
    async (projectId: number, projectData: ProjectUpdateRequest) =>
      commitMutation(
        updateDemoProject(stateRef.current, projectId, projectData),
      ),
    [commitMutation],
  );

  const archiveProject = useCallback(
    async (projectId: number) =>
      commitMutation(
        setDemoProjectArchived(stateRef.current, projectId, true),
      ),
    [commitMutation],
  );

  const unarchiveProject = useCallback(
    async (projectId: number) =>
      commitMutation(
        setDemoProjectArchived(stateRef.current, projectId, false),
      ),
    [commitMutation],
  );

  const createTask = useCallback(
    async (projectId: number, taskData: TaskCreateRequest) =>
      commitMutation(createDemoTask(stateRef.current, projectId, taskData)),
    [commitMutation],
  );

  const updateTask = useCallback(
    async (
      projectId: number,
      taskId: number,
      taskData: TaskUpdateRequest,
    ) =>
      commitMutation(
        updateDemoTask(stateRef.current, projectId, taskId, taskData),
      ),
    [commitMutation],
  );

  const completeTask = useCallback(
    async (projectId: number, taskId: number) =>
      commitMutation(completeDemoTask(stateRef.current, projectId, taskId)),
    [commitMutation],
  );

  const resetDemoData = useCallback(() => {
    const seededState = restoreSeedDemoState();
    stateRef.current = seededState;
    setState(seededState);
  }, []);

  const summary = useMemo(() => calculateDemoSummary(state), [state]);

  const value = useMemo<DemoContextValue>(
    () => ({
      currentUser: DEMO_USER,
      projects: state.projects,
      tasks: state.tasks,
      summary,
      getProject,
      getProjectTasks,
      createProject,
      updateProject,
      archiveProject,
      unarchiveProject,
      createTask,
      updateTask,
      completeTask,
      resetDemoData,
    }),
    [
      archiveProject,
      completeTask,
      createProject,
      createTask,
      getProject,
      getProjectTasks,
      resetDemoData,
      state.projects,
      state.tasks,
      summary,
      unarchiveProject,
      updateProject,
      updateTask,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext);

  if (!context) {
    throw new Error("useDemo must be used within a DemoProvider");
  }

  return context;
}
