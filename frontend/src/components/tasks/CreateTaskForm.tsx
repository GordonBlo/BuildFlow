import { useState, type FormEvent } from "react";

import type {
  TaskCreateRequest,
  TaskPriority,
  TaskStatus,
} from "../../types/task";
import ErrorMessage from "../ui/ErrorMessage";

type CreateTaskFormProps = {
  onSubmit: (taskData: TaskCreateRequest) => Promise<void>;
};

function CreateTaskForm({ onSubmit }: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearForm() {
    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("medium");
    setDueDate("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);

    const normalizedTitle = title.trim();

    if (normalizedTitle.length < 2) {
      setErrorMessage("Task title must contain at least 2 characters.");
      return;
    }

    const taskData: TaskCreateRequest = {
      title: normalizedTitle,
      description: description.trim() || null,
      status,
      priority,
      due_date: dueDate || null,
    };

    setIsSubmitting(true);

    try {
      await onSubmit(taskData);
      clearForm();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create Task.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="form-grid form-grid--two-columns"
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
    >
      <div className="form-field form-field--wide">
        <label htmlFor="task-title">
          Title
          <span className="required-marker" aria-hidden="true"> *</span>
        </label>
        <input
          id="task-title"
          name="title"
          type="text"
          minLength={2}
          maxLength={160}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div className="form-field form-field--wide">
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          name="description"
          maxLength={1000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="task-status">
          Status
          <span className="required-marker" aria-hidden="true"> *</span>
        </label>
        <select
          id="task-status"
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as TaskStatus)}
          required
        >
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="task-priority">
          Priority
          <span className="required-marker" aria-hidden="true"> *</span>
        </label>
        <select
          id="task-priority"
          name="priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as TaskPriority)}
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="task-due-date">Due date</label>
        <input
          id="task-due-date"
          name="due_date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      <div className="form-actions form-field--wide">
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Task..." : "Create Task"}
        </button>
      </div>
    </form>
  );
}

export default CreateTaskForm;
