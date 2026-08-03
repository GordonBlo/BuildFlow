import { useState, type FormEvent } from "react";

import {
  PROJECT_STATUS_OPTIONS,
  type ProjectResponse,
  type ProjectStatus,
  type ProjectUpdateRequest,
} from "../../types/project";

type EditProjectFormProps = {
  project: ProjectResponse;
  onSubmit: (projectData: ProjectUpdateRequest) => Promise<void>;
};

function EditProjectForm({ project, onSubmit }: EditProjectFormProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [clientName, setClientName] = useState(project.client_name ?? "");
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [budget, setBudget] = useState(String(project.budget));
  const [startDate, setStartDate] = useState(project.start_date ?? "");
  const [deadline, setDeadline] = useState(project.deadline ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const projectData: ProjectUpdateRequest = {};
    const normalizedName = name.trim();
    const normalizedDescription = description.trim() || null;
    const normalizedClientName = clientName.trim() || null;
    const numericBudget = Number(budget);
    const normalizedStartDate = startDate || null;
    const normalizedDeadline = deadline || null;

    if (normalizedName.length < 2) {
      setErrorMessage("Project name must contain at least 2 characters.");
      return;
    }

    if (
      !budget.trim() ||
      !Number.isFinite(numericBudget) ||
      numericBudget < 0
    ) {
      setErrorMessage("Budget must be zero or greater.");
      return;
    }

    if (normalizedName !== project.name) {
      projectData.name = normalizedName;
    }

    if (normalizedDescription !== project.description) {
      projectData.description = normalizedDescription;
    }

    if (normalizedClientName !== project.client_name) {
      projectData.client_name = normalizedClientName;
    }

    if (status !== project.status) {
      projectData.status = status;
    }

    if (numericBudget !== project.budget) {
      projectData.budget = numericBudget;
    }

    if (normalizedStartDate !== project.start_date) {
      projectData.start_date = normalizedStartDate;
    }

    if (normalizedDeadline !== project.deadline) {
      projectData.deadline = normalizedDeadline;
    }

    if (Object.keys(projectData).length === 0) {
      setErrorMessage("No Project fields have changed.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(projectData);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update project.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form-grid form-grid--two-columns" onSubmit={handleSubmit}>
      <div className="form-field form-field--wide">
        <label htmlFor="edit-project-name">Project name</label>
        <input
          id="edit-project-name"
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
        <label htmlFor="edit-project-description">Description</label>
        <textarea
          id="edit-project-description"
          name="description"
          maxLength={1000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="edit-project-client-name">Client name</label>
        <input
          id="edit-project-client-name"
          name="client_name"
          type="text"
          maxLength={120}
          value={clientName}
          onChange={(event) => setClientName(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="edit-project-status">Status</label>
        <select
          id="edit-project-status"
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
        <label htmlFor="edit-project-budget">Budget</label>
        <input
          id="edit-project-budget"
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
        <label htmlFor="edit-project-start-date">Start date</label>
        <input
          id="edit-project-start-date"
          name="start_date"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="edit-project-deadline">Deadline</label>
        <input
          id="edit-project-deadline"
          name="deadline"
          type="date"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
        />
      </div>

      {errorMessage && <p className="form-message" role="alert">{errorMessage}</p>}

      <div className="form-actions form-field--wide">
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving project..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export default EditProjectForm;
