import { useState } from "react"
import { Link, useParams } from "react-router"

import EditProjectForm from "../../components/projects/EditProjectForm"
import CreateTaskForm from "../../components/tasks/CreateTaskForm"
import TaskCard from "../../components/tasks/TaskCard"
import EmptyState from "../../components/ui/EmptyState"
import ErrorMessage from "../../components/ui/ErrorMessage"
import type { ProjectUpdateRequest } from "../../types/project"
import type { TaskCreateRequest, TaskUpdateRequest } from "../../types/task"
import { useDemo } from "../DemoContext"

function formatDate(value: string | null) {
  if (!value) {
    return "Not set"
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

function formatBudget(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function DemoProjectDetailsPage() {
  const { projectId } = useParams()
  const {
    getProject,
    getProjectTasks,
    updateProject,
    archiveProject,
    unarchiveProject,
    createTask,
    updateTask,
    completeTask,
  } = useDemo()
  const parsedProjectId = Number(projectId)
  const project = Number.isInteger(parsedProjectId) && parsedProjectId > 0
    ? getProject(parsedProjectId)
    : undefined
  const tasks = project ? getProjectTasks(project.id) : []
  const [projectMessage, setProjectMessage] = useState("")
  const [taskMessage, setTaskMessage] = useState("")
  const [archiveError, setArchiveError] = useState("")
  const [isChangingArchiveState, setIsChangingArchiveState] = useState(false)

  if (!project) {
    return (
      <div className="page state-page">
        <section className="panel state-card" aria-labelledby="demo-project-not-found-title">
            <p className="eyebrow">Demo project</p>
            <h1 id="demo-project-not-found-title">Project not found</h1>
            <p className="page-header__description">
              This sample project does not exist or may have been removed from this browser.
            </p>
          <Link className="button button--secondary" to="/demo/projects">
            Back to projects
          </Link>
        </section>
      </div>
    )
  }

  const currentProject = project

  async function handleProjectUpdate(payload: ProjectUpdateRequest) {
    setProjectMessage("")
    await updateProject(currentProject.id, payload)
    setProjectMessage("Project details updated in this browser.")
  }

  async function handleTaskCreate(payload: TaskCreateRequest) {
    setTaskMessage("")
    await createTask(currentProject.id, payload)
    setTaskMessage("Task added to the demo project.")
  }

  async function handleTaskUpdate(taskId: number, payload: TaskUpdateRequest) {
    setTaskMessage("")
    const updatedTask = await updateTask(currentProject.id, taskId, payload)
    setTaskMessage(`Task "${updatedTask.title}" updated.`)
  }

  async function handleTaskComplete(taskId: number) {
    setTaskMessage("")
    const completedTask = await completeTask(currentProject.id, taskId)
    setTaskMessage(`Task "${completedTask.title}" marked as done.`)
  }

  async function handleArchiveChange() {
    const action = currentProject.is_archived ? "unarchive" : "archive"
    const confirmed = window.confirm(
      currentProject.is_archived
        ? "Unarchive this demo project and allow changes again?"
        : "Archive this demo project? Its details and tasks will remain readable.",
    )

    if (!confirmed) {
      return
    }

    setIsChangingArchiveState(true)
    setArchiveError("")

    try {
      if (currentProject.is_archived) {
        await unarchiveProject(currentProject.id)
      } else {
        await archiveProject(currentProject.id)
      }
      setProjectMessage(
        action === "archive"
          ? "Project archived. It is now read-only."
          : "Project unarchived. Editing is available again.",
      )
    } catch (error) {
      setArchiveError(error instanceof Error ? error.message : `Unable to ${action} project.`)
    } finally {
      setIsChangingArchiveState(false)
    }
  }

  return (
    <div className="page project-details-page" aria-labelledby="demo-project-title">
      <div className="page-header">
        <div>
          <Link className="breadcrumb" to="/demo/projects">
            <span aria-hidden="true">&larr;</span> All demo projects
          </Link>
          <p className="eyebrow">Demo project details</p>
          <h1 id="demo-project-title">{project.name}</h1>
          <p className="page-header__description">{project.description || "No project description provided."}</p>
        </div>
        <span className={`badge badge--large ${project.is_archived ? "badge--neutral" : "badge--success"}`}>
          {project.is_archived ? "Archived project" : "Current project"}
        </span>
      </div>

      {projectMessage ? <p role="status">{projectMessage}</p> : null}

      <div className="dashboard-grid">
        <section className="panel" aria-labelledby="demo-project-overview-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Project overview</p>
              <h2 id="demo-project-overview-title">Delivery details</h2>
            </div>
          </div>
          <dl className="detail-list">
            <div>
              <dt>Client</dt>
              <dd>{project.client_name || "Not set"}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{project.status.replace("_", " ")}</dd>
            </div>
            <div>
              <dt>Budget</dt>
              <dd>{formatBudget(project.budget)}</dd>
            </div>
            <div>
              <dt>Start date</dt>
              <dd>{formatDate(project.start_date)}</dd>
            </div>
            <div>
              <dt>Deadline</dt>
              <dd>{formatDate(project.deadline)}</dd>
            </div>
          </dl>
        </section>

        <section className="panel" aria-labelledby="demo-project-edit-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Project controls</p>
              <h2 id="demo-project-edit-title">Edit project</h2>
            </div>
          </div>
          {project.is_archived ? (
            <p className="read-only-notice">
              Archived projects are read-only. Unarchive this project to edit its details.
            </p>
          ) : (
            <EditProjectForm project={project} onSubmit={handleProjectUpdate} />
          )}
        </section>
      </div>

      <section className="page-section" aria-labelledby="demo-project-tasks-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Project tasks</p>
            <h2 id="demo-project-tasks-title">Task plan</h2>
            <p>{tasks.length} task{tasks.length === 1 ? "" : "s"} in this project</p>
          </div>
        </div>

        {project.is_archived ? (
          <p className="read-only-notice">
            Tasks remain visible for historical reference, but archived project tasks cannot be changed.
          </p>
        ) : null}
        {taskMessage ? <p role="status">{taskMessage}</p> : null}

        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description={project.is_archived
              ? "This archived project has no task history."
              : "Add the first task to begin planning this project."}
          />
        ) : (
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

      {!project.is_archived ? (
        <section className="panel" aria-labelledby="demo-create-task-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Add work</p>
              <h2 id="demo-create-task-title">Create task</h2>
            </div>
          </div>
          <CreateTaskForm onSubmit={handleTaskCreate} />
        </section>
      ) : null}

      <section className="panel archive-panel" aria-labelledby="demo-archive-title">
        <div>
          <p className="eyebrow">Project lifecycle</p>
          <h2 id="demo-archive-title">{project.is_archived ? "Unarchive project" : "Archive project"}</h2>
          <p>
            {project.is_archived
              ? "Restore editing and task controls for this demo project."
              : "Keep the project and task history while making the project read-only."}
          </p>
        </div>
        <div>
          {archiveError ? <ErrorMessage message={archiveError} /> : null}
          <button
            className={`button ${project.is_archived ? "button--secondary" : "button--danger"}`}
            type="button"
            onClick={handleArchiveChange}
            disabled={isChangingArchiveState}
          >
            {isChangingArchiveState
              ? "Saving…"
              : project.is_archived
                ? "Unarchive project"
                : "Archive project"}
          </button>
        </div>
      </section>
    </div>
  )
}

export default DemoProjectDetailsPage
