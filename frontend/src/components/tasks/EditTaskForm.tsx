import { useState, type FormEvent } from "react";

import type {
  TaskPriority,
  TaskResponse,
  TaskStatus,
  TaskUpdateRequest,
} from "../../types/task";

type EditTaskFormProps = {
  task: TaskResponse;
  onSubmit: (taskData: TaskUpdateRequest) => Promise<void>;
  onCancel: () => void;
};

function EditTaskForm({ task, onSubmit, onCancel }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState(task.due_date ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const taskData: TaskUpdateRequest = {};
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim() || null;
    const normalizedDueDate = dueDate || null;

    if (normalizedTitle.length < 2) {
      setErrorMessage("Task title must contain at least 2 characters.");
      return;
    }

    if (normalizedTitle !== task.title) {
      taskData.title = normalizedTitle;
    }

    if (normalizedDescription !== task.description) {
      taskData.description = normalizedDescription;
    }

    if (status !== task.status) {
      taskData.status = status;
    }

    if (priority !== task.priority) {
      taskData.priority = priority;
    }

    if (normalizedDueDate !== task.due_date) {
      taskData.due_date = normalizedDueDate;
    }

    if (Object.keys(taskData).length === 0) {
      setErrorMessage("No Task fields have changed.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(taskData);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update Task.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={isSubmitting}>
        <legend>Edit Task</legend>

        <div>
          <label htmlFor={`edit-task-title-${task.id}`}>Title</label>
          <input
            id={`edit-task-title-${task.id}`}
            name="title"
            type="text"
            minLength={2}
            maxLength={160}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor={`edit-task-description-${task.id}`}>
            Description
          </label>
          <textarea
            id={`edit-task-description-${task.id}`}
            name="description"
            maxLength={1000}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor={`edit-task-status-${task.id}`}>Status</label>
          <select
            id={`edit-task-status-${task.id}`}
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskStatus)}
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label htmlFor={`edit-task-priority-${task.id}`}>Priority</label>
          <select
            id={`edit-task-priority-${task.id}`}
            name="priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TaskPriority)
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor={`edit-task-due-date-${task.id}`}>Due date</label>
          <input
            id={`edit-task-due-date-${task.id}`}
            name="due_date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>

        {errorMessage && <p role="alert">{errorMessage}</p>}

        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving Task..." : "Save"}
        </button>
      </fieldset>
    </form>
  );
}

export default EditTaskForm;
