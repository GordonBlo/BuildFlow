import { useState } from "react";

import EditTaskForm from "./EditTaskForm";
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
      <article>
        <EditTaskForm
          task={task}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </article>
    );
  }

  return (
    <article>
      <header>
        <h3>{task.title}</h3>
      </header>

      {task.description && <p>{task.description}</p>}

      <dl>
        <dt>Status</dt>
        <dd>{task.status}</dd>

        <dt>Priority</dt>
        <dd>{task.priority}</dd>

        {task.due_date && (
          <>
            <dt>Due date</dt>
            <dd>{formatDueDate(task.due_date)}</dd>
          </>
        )}
      </dl>

      {errorMessage && <p role="alert">{errorMessage}</p>}

      {!isProjectArchived && (
        <footer>
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setIsEditing(true);
            }}
            disabled={isCompleting}
          >
            Edit
          </button>

          {task.status !== "done" && (
            <button
              type="button"
              onClick={handleComplete}
              disabled={isCompleting}
            >
              {isCompleting ? "Completing Task..." : "Complete"}
            </button>
          )}
        </footer>
      )}
    </article>
  );
}

export default TaskCard;
