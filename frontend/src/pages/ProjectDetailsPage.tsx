import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { ApiError } from "../api/apiClient";
import {
  archiveProject,
  getProjectById,
  unarchiveProject,
  updateProject,
} from "../api/projectApi";
import {
  completeTask,
  createTask,
  getTasksByProject,
  updateTask,
} from "../api/taskApi";
import EditProjectForm from "../components/projects/EditProjectForm";
import CreateTaskForm from "../components/tasks/CreateTaskForm";
import TaskCard from "../components/tasks/TaskCard";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingState from "../components/ui/LoadingState";
import type {
  ProjectResponse,
  ProjectUpdateRequest,
} from "../types/project";
import type {
  TaskCreateRequest,
  TaskResponse,
  TaskUpdateRequest,
} from "../types/task";

function formatDate(value: string | null): string {
  if (!value) {
    return "Not set";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

function ProjectDetailsPage() {
  const { projectId } = useParams();
  const numericProjectId = Number(projectId);
  const isValidProjectId =
    Number.isInteger(numericProjectId) && numericProjectId > 0;
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isUnarchiving, setIsUnarchiving] = useState(false);
  const [projectLoadAttempt, setProjectLoadAttempt] = useState(0);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [taskErrorMessage, setTaskErrorMessage] = useState<string | null>(null);
  const [areTasksLoading, setAreTasksLoading] = useState(true);
  const [taskLoadAttempt, setTaskLoadAttempt] = useState(0);

  useEffect(() => {
    if (!isValidProjectId) {
      return;
    }

    let isMounted = true;

    async function loadProject() {
      try {
        const response = await getProjectById(numericProjectId);

        if (isMounted) {
          setProject(response);
        }
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError && error.status === 404) {
          setIsNotFound(true);
        } else {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load project.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProject();

    return () => {
      isMounted = false;
    };
  }, [isValidProjectId, numericProjectId, projectLoadAttempt]);

  useEffect(() => {
    if (!isValidProjectId) {
      return;
    }

    let isMounted = true;

    async function loadTasks() {
      try {
        const response = await getTasksByProject(numericProjectId);

        if (isMounted) {
          setTasks(response);
        }
      } catch (error: unknown) {
        if (isMounted) {
          setTaskErrorMessage(
            error instanceof Error ? error.message : "Unable to load Tasks.",
          );
        }
      } finally {
        if (isMounted) {
          setAreTasksLoading(false);
        }
      }
    }

    void loadTasks();

    return () => {
      isMounted = false;
    };
  }, [isValidProjectId, numericProjectId, taskLoadAttempt]);

  function handleProjectRetry() {
    setErrorMessage(null);
    setIsLoading(true);
    setProjectLoadAttempt((attempt) => attempt + 1);
  }

  function handleTaskRetry() {
    setTaskErrorMessage(null);
    setAreTasksLoading(true);
    setTaskLoadAttempt((attempt) => attempt + 1);
  }

  async function handleUpdate(projectData: ProjectUpdateRequest) {
    if (!project || project.is_archived) {
      throw new Error("Archived Projects are read-only.");
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updatedProject = await updateProject(
        numericProjectId,
        projectData,
      );
      setProject(updatedProject);
      setSuccessMessage("Project updated successfully.");
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 404) {
        setIsNotFound(true);
      }

      throw error;
    }
  }

  async function handleUnarchive() {
    if (!project || !project.is_archived || isUnarchiving) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsUnarchiving(true);

    try {
      const unarchivedProject = await unarchiveProject(numericProjectId);
      setProject(unarchivedProject);
      setSuccessMessage("Project unarchived successfully.");
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 404) {
        setIsNotFound(true);
      } else {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to unarchive project.",
        );
      }
    } finally {
      setIsUnarchiving(false);
    }
  }

  async function handleArchive() {
    if (
      !project ||
      project.is_archived ||
      isArchiving ||
      !window.confirm("Archive this project?")
    ) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsArchiving(true);

    try {
      const archivedProject = await archiveProject(numericProjectId);
      setProject(archivedProject);
      setSuccessMessage("Project archived successfully.");
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 404) {
        setIsNotFound(true);
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to archive project.",
        );
      }
    } finally {
      setIsArchiving(false);
    }
  }

  async function handleCreateTask(taskData: TaskCreateRequest) {
    if (!project || project.is_archived) {
      throw new Error("Archived Projects are read-only.");
    }

    const createdTask = await createTask(numericProjectId, taskData);
    setTasks((currentTasks) => [createdTask, ...currentTasks]);
  }

  function replaceTask(updatedTask: TaskResponse) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );
  }

  async function handleTaskUpdate(
    taskId: number,
    taskData: TaskUpdateRequest,
  ) {
    if (!project || project.is_archived) {
      throw new Error("Archived Projects are read-only.");
    }

    const updatedTask = await updateTask(
      numericProjectId,
      taskId,
      taskData,
    );
    replaceTask(updatedTask);
  }

  async function handleTaskComplete(taskId: number) {
    if (!project || project.is_archived) {
      throw new Error("Archived Projects are read-only.");
    }

    const completedTask = await completeTask(numericProjectId, taskId);
    replaceTask(completedTask);
  }

  if (!isValidProjectId) {
    return (
      <div className="page state-page">
        <div className="panel state-card">
          <p className="eyebrow">Invalid request</p>
          <h1>Project details</h1>
          <ErrorMessage message="The Project ID must be a positive integer." />
          <Link className="button button--secondary" to="/projects">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page state-page">
        <div className="panel state-card">
          <p className="eyebrow">Project workspace</p>
          <h1>Project details</h1>
          <LoadingState message="Loading project..." />
          <Link className="text-link" to="/projects">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="page state-page">
        <div className="panel state-card">
          <p className="eyebrow">404 error</p>
          <h1>Project not found</h1>
          <p>The requested Project could not be found.</p>
          <Link className="button button--secondary" to="/projects">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  if (errorMessage || !project) {
    return (
      <div className="page state-page">
        <div className="panel state-card">
          <p className="eyebrow">Unable to load</p>
          <h1>Project details</h1>
          <ErrorMessage
            message={errorMessage ?? "Unable to load project."}
            onRetry={handleProjectRetry}
          />
          <Link className="button button--secondary" to="/projects">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page project-details-page">
      <header className="page-header project-page-header">
        <div>
          <Link className="breadcrumb" to="/projects">
            <span aria-hidden="true">&larr;</span> Projects
          </Link>
          <p className="eyebrow">Project details</p>
          <h1>{project.name}</h1>
          <p className="page-header__description">
            {project.description ?? "No project description has been added."}
          </p>
        </div>
        <span
          className={`badge badge--large ${
            project.is_archived ? "badge--neutral" : "badge--success"
          }`}
        >
          {project.is_archived ? "Archived project" : "Active project"}
        </span>
      </header>

      {successMessage && <p role="status">{successMessage}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}

      <section className="panel" aria-labelledby="project-information-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Snapshot</p>
            <h2 id="project-information-heading">Project information</h2>
          </div>
          <span className="badge badge--outline">{project.status}</span>
        </div>

        <dl className="detail-grid">
          <div>
            <dt>Client</dt>
            <dd>{project.client_name ?? "Not set"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
          <div>
            <dt>Budget</dt>
            <dd>{project.budget.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Start date</dt>
            <dd>{formatDate(project.start_date)}</dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd>{formatDate(project.deadline)}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{new Date(project.created_at).toLocaleString()}</dd>
          </div>
        </dl>
      </section>

      <section className="panel" aria-labelledby="edit-project-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Project setup</p>
            <h2 id="edit-project-heading">Edit project</h2>
          </div>
        </div>
        {project.is_archived ? (
          <p className="read-only-notice">
            This Project is read-only until it is unarchived.
          </p>
        ) : (
          <EditProjectForm
            key={project.id}
            project={project}
            onSubmit={handleUpdate}
          />
        )}
      </section>

      <section className="page-section" aria-labelledby="project-tasks-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Work plan</p>
            <h2 id="project-tasks-heading">Tasks</h2>
          </div>
          {!areTasksLoading && !taskErrorMessage && (
            <span className="record-count">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          )}
        </div>

        {project.is_archived && (
          <p className="read-only-notice">
            Archived Projects are read-only. Existing Tasks remain available.
          </p>
        )}

        {areTasksLoading && <LoadingState message="Loading Tasks..." />}
        {taskErrorMessage && (
          <ErrorMessage
            message={taskErrorMessage}
            onRetry={handleTaskRetry}
          />
        )}

        {!areTasksLoading && !taskErrorMessage && tasks.length === 0 && (
          <EmptyState
            title="No tasks yet"
            description="This Project does not have any Tasks yet."
          >
            {!project.is_archived && (
              <a
                className="button button--secondary button--compact"
                href="#create-task-heading"
              >
                Create a task
              </a>
            )}
          </EmptyState>
        )}

        {!areTasksLoading && tasks.length > 0 && (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  isProjectArchived={project.is_archived}
                  onUpdate={handleTaskUpdate}
                  onComplete={handleTaskComplete}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {!project.is_archived && (
        <section className="panel" aria-labelledby="create-task-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Add work</p>
              <h2 id="create-task-heading">Create task</h2>
            </div>
          </div>
          <CreateTaskForm onSubmit={handleCreateTask} />
        </section>
      )}

      <section
        className="panel archive-panel"
        aria-labelledby="project-archive-state-heading"
      >
        <div>
          <p className="eyebrow">Project access</p>
          <h2 id="project-archive-state-heading">
            {project.is_archived ? "Unarchive project" : "Archive project"}
          </h2>
          <p>
            {project.is_archived
              ? "Restore editing and task management for this project."
              : "Make this project read-only while keeping its history available."}
          </p>
        </div>
        {project.is_archived ? (
          <button
            className="button button--secondary"
            type="button"
            onClick={handleUnarchive}
            disabled={isUnarchiving}
          >
            {isUnarchiving ? "Unarchiving project..." : "Unarchive project"}
          </button>
        ) : (
          <button
            className="button button--danger"
            type="button"
            onClick={handleArchive}
            disabled={isArchiving}
          >
            {isArchiving ? "Archiving project..." : "Archive project"}
          </button>
        )}
      </section>
    </div>
  );
}

export default ProjectDetailsPage;
