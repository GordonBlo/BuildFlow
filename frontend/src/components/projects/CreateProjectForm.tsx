import { useState, type FormEvent } from "react";

import type { ProjectCreateRequest } from "../../types/project";

type CreateProjectFormProps = {
  onSubmit: (projectData: ProjectCreateRequest) => Promise<void>;
};

function CreateProjectForm({ onSubmit }: CreateProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [status, setStatus] = useState("planned");
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
      budget: numericBudget,
      start_date: startDate || null,
      deadline: deadline || null,
    };
    const normalizedStatus = status.trim();

    if (normalizedStatus) {
      projectData.status = normalizedStatus;
    }

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
    <form onSubmit={handleSubmit}>
      <div>
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

      <div>
        <label htmlFor="project-description">Description</label>
        <textarea
          id="project-description"
          name="description"
          maxLength={1000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div>
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

      <div>
        <label htmlFor="project-status">Status</label>
        <input
          id="project-status"
          name="status"
          type="text"
          maxLength={50}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        />
      </div>

      <div>
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

      <div>
        <label htmlFor="project-start-date">Start date</label>
        <input
          id="project-start-date"
          name="start_date"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="project-deadline">Deadline</label>
        <input
          id="project-deadline"
          name="deadline"
          type="date"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
        />
      </div>

      {errorMessage && <p role="alert">{errorMessage}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating project..." : "Create project"}
      </button>
    </form>
  );
}

export default CreateProjectForm;
