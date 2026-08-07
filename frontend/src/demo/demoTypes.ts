import type { CurrentUserResponse } from "../types/auth";
import type { ProjectResponse } from "../types/project";
import type { TaskResponse } from "../types/task";

export type DemoUser = CurrentUserResponse & {
  role: "Project Manager";
};

export type DemoState = {
  schemaVersion: 1;
  projects: ProjectResponse[];
  tasks: TaskResponse[];
};

export type DemoMutation<T> = {
  state: DemoState;
  value: T;
};
