import { useEffect, useState } from "react";
import { Link } from "react-router";

import { createProject, getProjects } from "../api/projectApi";
import CreateProjectForm from "../components/projects/CreateProjectForm";
import ProjectCard from "../components/projects/ProjectCard";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingState from "../components/ui/LoadingState";
import type {
  ProjectCreateRequest,
  ProjectResponse,
} from "../types/project";

function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        const response = await getProjects();

        if (isMounted) {
          setProjects(response);
        }
      } catch (error: unknown) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load projects.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, [loadAttempt]);

  function handleRetry() {
    setErrorMessage(null);
    setIsLoading(true);
    setLoadAttempt((attempt) => attempt + 1);
  }

  async function handleCreateProject(projectData: ProjectCreateRequest) {
    const createdProject = await createProject(projectData);
    setProjects((currentProjects) => [createdProject, ...currentProjects]);
  }

  return (
    <div className="page projects-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>Projects</h1>
          <p className="page-header__description">
            Create, review, and manage every active build in one place.
          </p>
        </div>
        <Link className="text-link" to="/dashboard">
          Back to dashboard
        </Link>
      </header>

      <section className="panel" aria-labelledby="create-project-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">New work</p>
            <h2 id="create-project-heading">Create project</h2>
          </div>
        </div>
        <CreateProjectForm onSubmit={handleCreateProject} />
      </section>

      <section className="page-section" aria-labelledby="project-list-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h2 id="project-list-heading">Your projects</h2>
          </div>
          {!isLoading && !errorMessage && (
            <span className="record-count">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </span>
          )}
        </div>

        {isLoading && <LoadingState message="Loading projects..." />}
        {errorMessage && (
          <ErrorMessage message={errorMessage} onRetry={handleRetry} />
        )}

        {!isLoading && !errorMessage && projects.length === 0 && (
          <EmptyState
            title="No active projects yet"
            description="Create your first project above to start organizing the work."
          >
            <a
              className="button button--secondary button--compact"
              href="#create-project-heading"
            >
              Create a project
            </a>
          </EmptyState>
        )}

        {!isLoading && projects.length > 0 && (
          <ul className="card-grid project-list">
            {projects.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default ProjectsPage;
