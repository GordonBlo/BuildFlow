import { useState } from "react";

import EditTaskForm from "./EditTaskForm";
import ErrorMessage from "../ui/ErrorMessage";
import type { TaskResponse, TaskUpdateRequest } from "../../types/task";

type TaskCardProps = {
  task: TaskResponse;
  isProjectArchived: boolean;
  onUpdate: (taskId: number, taskData: TaskUpdateRequest) => Promise<void>;
  onComplete: (taskId: number) => Promise<void>;
};

function formatDueDate(dueDate: string): string {
  return new Date(`${dueDate}T00:00:00`).toLocaleDateString();
}

function TaskCard({
  task,
  isProjectArchived,
  onUpdate,
  onComplete,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleUpdate(taskData: TaskUpdateRequest) {
    await onUpdate(task.id, taskData);
    setIsEditing(false);
  }

  async function handleComplete() {
    if (isCompleting || task.status === "done" || isProjectArchived) {
      return;
    }

    setErrorMessage(null);
    setIsCompleting(true);

    try {
      await onComplete(task.id);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to complete Task.",
      );
    } finally {
      setIsCompleting(false);
    }
  }

  if (isEditing && !isProjectArchived) {
    return (
      <article className="task-card task-card--editing">
        <EditTaskForm
          task={task}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </article>
    );
  }

  return (
    <article className="task-card">
      <header className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <div className="badge-group" aria-label="Task classification">
          <span
            className={`badge task-card__status badge--${task.status.replace("_", "-")}`}
          >
            {task.status.replace("_", " ")}
          </span>
          <span
            className={`badge task-card__priority badge--priority-${task.priority}`}
          >
            {task.priority} priority
          </span>
        </div>
      </header>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      {task.due_date && (
        <dl className="task-meta">
          <div>
            <dt>Due date</dt>
            <dd>{formatDueDate(task.due_date)}</dd>
          </div>
        </dl>
      )}

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {!isProjectArchived && (
        <footer className="task-card__actions">
          <button
            className="button button--secondary button--compact"
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setIsEditing(true);
            }}
            disabled={isCompleting}
          >
            Edit task
          </button>

          {task.status !== "done" && (
            <button
              className="button button--compact"
              type="button"
              onClick={handleComplete}
              disabled={isCompleting}
            >
              {isCompleting ? "Completing Task..." : "Complete task"}
            </button>
          )}
        </footer>
      )}
    </article>
  );
}

export default TaskCard;
