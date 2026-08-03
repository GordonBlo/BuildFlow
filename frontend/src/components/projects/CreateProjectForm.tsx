import { useState, type FormEvent } from "react";

import {
  PROJECT_STATUS_OPTIONS,
  type ProjectCreateRequest,
  type ProjectStatus,
} from "../../types/project";

type CreateProjectFormProps = {
  onSubmit: (projectData: ProjectCreateRequest) => Promise<void>;
};

function CreateProjectForm({ onSubmit }: CreateProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("planned");
  const [budget, setBudget] = useState("0");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearForm() {
    setName("");
    setDescription("");
    setClientName("");
    setStatus("planned");
    setBudget("0");
    setStartDate("");
    setDeadline("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const normalizedName = name.trim();
    const numericBudget = Number(budget);

    if (normalizedName.length < 2) {
      setErrorMessage("Project name must contain at least 2 characters.");
      return;
    }

    if (!Number.isFinite(numericBudget) || numericBudget < 0) {
      setErrorMessage("Budget must be zero or greater.");
      return;
    }

    const projectData: ProjectCreateRequest = {
      name: normalizedName,
      description: description.trim() || null,
      client_name: clientName.trim() || null,
      status,
      budget: numericBudget,
      start_date: startDate || null,
      deadline: deadline || null,
    };

    setIsSubmitting(true);

    try {
      await onSubmit(projectData);
      clearForm();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create project.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form-grid form-grid--two-columns" onSubmit={handleSubmit}>
      <div className="form-field form-field--wide">
        <label htmlFor="project-name">Project name</label>
        <input
          id="project-name"
          name="name"
          type="text"
          minLength={2}
          maxLength={120}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>

      <div className="form-field form-field--wide">
        <label htmlFor="project-description">Description</label>
        <textarea
          id="project-description"
          name="description"
          maxLength={1000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="project-client-name">Client name</label>
        <input
          id="project-client-name"
          name="client_name"
          type="text"
          maxLength={120}
          value={clientName}
          onChange={(event) => setClientName(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="project-status">Status</label>
        <select
          id="project-status"
          name="status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as ProjectStatus)
          }
          required
        >
          {PROJECT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="project-budget">Budget</label>
        <input
          id="project-budget"
          name="budget"
          type="number"
          min="0"
          step="any"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="project-start-date">Start date</label>
        <input
          id="project-start-date"
          name="start_date"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="project-deadline">Deadline</label>
        <input
          id="project-deadline"
          name="deadline"
          type="date"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
        />
      </div>

      {errorMessage && <p className="form-message" role="alert">{errorMessage}</p>}

      <div className="form-actions form-field--wide">
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating project..." : "Create project"}
        </button>
      </div>
    </form>
  );
}

export default CreateProjectForm;
