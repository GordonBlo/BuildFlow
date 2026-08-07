import { useState } from "react";
import { Link } from "react-router";

import CreateProjectForm from "../../components/projects/CreateProjectForm";
import ProjectCard from "../../components/projects/ProjectCard";
import EmptyState from "../../components/ui/EmptyState";
import type { ProjectCreateRequest } from "../../types/project";
import { useDemo } from "../DemoContext";

function DemoProjectsPage() {
  const { projects, createProject } = useDemo();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const visibleProjects = projects.filter((project) => !project.is_archived);
  const archivedProjects = projects.filter((project) => project.is_archived);

  async function handleCreateProject(projectData: ProjectCreateRequest) {
    const project = await createProject(projectData);
    setSuccessMessage(`${project.name} was created in the demo workspace.`);
  }

  return (
    <div className="page projects-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Demo workspace</p>
          <h1>Projects</h1>
          <p className="page-header__description">
            Create, review, and manage sample construction projects. Changes
            are saved in this browser.
          </p>
        </div>
        <Link className="text-link" to="/demo/dashboard">
          Back to dashboard
        </Link>
      </header>

      {successMessage && <p role="status">{successMessage}</p>}

      <section className="panel" aria-labelledby="demo-create-project-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">New work</p>
            <h2 id="demo-create-project-heading">Create project</h2>
          </div>
        </div>
        <CreateProjectForm onSubmit={handleCreateProject} />
      </section>

      <section className="page-section" aria-labelledby="demo-project-list-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h2 id="demo-project-list-heading">Current projects</h2>
          </div>
          <span className="record-count">
            {visibleProjects.length}{" "}
            {visibleProjects.length === 1 ? "project" : "projects"}
          </span>
        </div>

        {visibleProjects.length === 0 ? (
          <EmptyState
            title="No current projects"
            description="Create a project above or reset the demo data to restore the sample portfolio."
          />
        ) : (
          <ul className="card-grid project-list">
            {visibleProjects.map((project) => (
              <li key={project.id}>
                <ProjectCard
                  project={project}
                  detailsBasePath="/demo/projects"
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="page-section" aria-labelledby="demo-archive-list-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">History</p>
            <h2 id="demo-archive-list-heading">Archived projects</h2>
          </div>
          <span className="record-count">
            {archivedProjects.length}{" "}
            {archivedProjects.length === 1 ? "project" : "projects"}
          </span>
        </div>

        {archivedProjects.length === 0 ? (
          <EmptyState
            title="No archived projects"
            description="Archived projects will remain available here as read-only history."
          />
        ) : (
          <ul className="card-grid project-list">
            {archivedProjects.map((project) => (
              <li key={project.id}>
                <ProjectCard
                  project={project}
                  detailsBasePath="/demo/projects"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default DemoProjectsPage;
