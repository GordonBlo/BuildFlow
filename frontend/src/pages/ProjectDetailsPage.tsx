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
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [taskErrorMessage, setTaskErrorMessage] = useState<string | null>(null);
  const [areTasksLoading, setAreTasksLoading] = useState(true);

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
  }, [isValidProjectId, numericProjectId]);

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
  }, [isValidProjectId, numericProjectId]);

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
      <main>
        <h1>Project Details</h1>
        <p role="alert">The Project ID must be a positive integer.</p>
        <Link to="/projects">Back to Projects</Link>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main>
        <h1>Project Details</h1>
        <p role="status">Loading project...</p>
        <Link to="/projects">Back to Projects</Link>
      </main>
    );
  }

  if (isNotFound) {
    return (
      <main>
        <h1>Project Not Found</h1>
        <p>The requested Project could not be found.</p>
        <Link to="/projects">Back to Projects</Link>
      </main>
    );
  }

  if (errorMessage || !project) {
    return (
      <main>
        <h1>Project Details</h1>
        <p role="alert">{errorMessage ?? "Unable to load project."}</p>
        <Link to="/projects">Back to Projects</Link>
      </main>
    );
  }

  return (
    <main>
      <header>
        <h1>{project.name}</h1>
        <p>{project.is_archived ? "Archived Project" : "Active Project"}</p>
        <Link to="/projects">Back to Projects</Link>
      </header>

      {successMessage && <p role="status">{successMessage}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}

      <section aria-labelledby="project-information-heading">
        <h2 id="project-information-heading">Project Information</h2>
        {project.description && <p>{project.description}</p>}

        <dl>
          <dt>Client</dt>
          <dd>{project.client_name ?? "Not set"}</dd>

          <dt>Status</dt>
          <dd>{project.status}</dd>

          <dt>Budget</dt>
          <dd>{project.budget.toLocaleString()}</dd>

          <dt>Start date</dt>
          <dd>{formatDate(project.start_date)}</dd>

          <dt>Deadline</dt>
          <dd>{formatDate(project.deadline)}</dd>

          <dt>Created</dt>
          <dd>{new Date(project.created_at).toLocaleString()}</dd>
        </dl>
      </section>

      <section aria-labelledby="edit-project-heading">
        <h2 id="edit-project-heading">Edit Project</h2>
        {project.is_archived ? (
          <p>This Project is read-only until it is unarchived.</p>
        ) : (
          <EditProjectForm
            key={project.id}
            project={project}
            onSubmit={handleUpdate}
          />
        )}
      </section>

      <section aria-labelledby="project-tasks-heading">
        <h2 id="project-tasks-heading">Tasks</h2>

        {project.is_archived && (
          <p>
            Archived Projects are read-only. Existing Tasks remain available.
          </p>
        )}

        {areTasksLoading && <p role="status">Loading Tasks...</p>}
        {taskErrorMessage && <p role="alert">{taskErrorMessage}</p>}

        {!areTasksLoading && !taskErrorMessage && tasks.length === 0 && (
          <p>This Project does not have any Tasks yet.</p>
        )}

        {!areTasksLoading && tasks.length > 0 && (
          <ul>
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
        <section aria-labelledby="create-task-heading">
          <h2 id="create-task-heading">Create Task</h2>
          <CreateTaskForm onSubmit={handleCreateTask} />
        </section>
      )}

      <section aria-labelledby="project-archive-state-heading">
        <h2 id="project-archive-state-heading">
          {project.is_archived ? "Unarchive Project" : "Archive Project"}
        </h2>
        {project.is_archived ? (
          <button
            type="button"
            onClick={handleUnarchive}
            disabled={isUnarchiving}
          >
            {isUnarchiving ? "Unarchiving project..." : "Unarchive project"}
          </button>
        ) : (
          <button type="button" onClick={handleArchive} disabled={isArchiving}>
            {isArchiving ? "Archiving project..." : "Archive project"}
          </button>
        )}
      </section>
    </main>
  );
}

export default ProjectDetailsPage;
