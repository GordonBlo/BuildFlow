import { createSeedDemoState } from "./demoData";
import type { DemoState } from "./demoTypes";

const DEMO_STORAGE_KEY = "buildflow_demo_state_v1";
const projectStatuses = new Set(["planned", "active", "completed"]);
const taskStatuses = new Set(["todo", "in_progress", "done"]);
const taskPriorities = new Set(["low", "medium", "high"]);

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDemoProject(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.status === "string" &&
    projectStatuses.has(value.status) &&
    typeof value.budget === "number" &&
    typeof value.is_archived === "boolean" &&
    typeof value.created_at === "string"
  );
}

function isDemoTask(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.project_id === "number" &&
    typeof value.title === "string" &&
    typeof value.status === "string" &&
    taskStatuses.has(value.status) &&
    typeof value.priority === "string" &&
    taskPriorities.has(value.priority) &&
    typeof value.created_at === "string" &&
    typeof value.updated_at === "string"
  );
}

function isDemoState(value: unknown): value is DemoState {
  return (
    isRecord(value) &&
    value.schemaVersion === 1 &&
    Array.isArray(value.projects) &&
    value.projects.every(isDemoProject) &&
    Array.isArray(value.tasks) &&
    value.tasks.every(isDemoTask)
  );
}

export function saveDemoState(state: DemoState): void {
  try {
    getBrowserStorage()?.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Demo interactions continue in memory when browser storage is unavailable.
  }
}

export function loadDemoState(): DemoState {
  const storage = getBrowserStorage();

  if (storage) {
    try {
      const storedValue = storage.getItem(DEMO_STORAGE_KEY);

      if (storedValue) {
        const parsedValue: unknown = JSON.parse(storedValue);

        if (isDemoState(parsedValue)) {
          return parsedValue;
        }
      }
    } catch {
      // Invalid or unavailable storage falls back to the original seed data.
    }
  }

  const seededState = createSeedDemoState();
  saveDemoState(seededState);
  return seededState;
}

export function restoreSeedDemoState(): DemoState {
  const seededState = createSeedDemoState();
  saveDemoState(seededState);
  return seededState;
}
