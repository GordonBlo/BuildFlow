import { useEffect, useState } from "react";
import { Link } from "react-router";

import { createProject, getProjects } from "../api/projectApi";
import CreateProjectForm from "../components/projects/CreateProjectForm";
import ProjectCard from "../components/projects/ProjectCard";
import type {
  ProjectCreateRequest,
  ProjectResponse,
} from "../types/project";

function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  async function handleCreateProject(projectData: ProjectCreateRequest) {
    const createdProject = await createProject(projectData);
    setProjects((currentProjects) => [createdProject, ...currentProjects]);
  }

  return (
    <main>
      <header>
        <h1>Projects</h1>
        <Link to="/dashboard">Back to Dashboard</Link>
      </header>

      <section aria-labelledby="create-project-heading">
        <h2 id="create-project-heading">Create Project</h2>
        <CreateProjectForm onSubmit={handleCreateProject} />
      </section>

      <section aria-labelledby="project-list-heading">
        <h2 id="project-list-heading">Your Projects</h2>

        {isLoading && <p role="status">Loading projects...</p>}
        {errorMessage && <p role="alert">{errorMessage}</p>}

        {!isLoading && !errorMessage && projects.length === 0 && (
          <p>You do not have any active projects yet.</p>
        )}

        {!isLoading && projects.length > 0 && (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default ProjectsPage;
