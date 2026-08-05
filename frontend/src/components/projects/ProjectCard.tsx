import { Link } from "react-router";

import type { ProjectResponse } from "../../types/project";

type ProjectCardProps = {
  project: ProjectResponse;
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Not set";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <header className="project-card__header">
        <h2 className="project-card__title">
          <Link to={`/projects/${project.id}`}>{project.name}</Link>
        </h2>
        <span
          className={`badge project-card__archive-badge ${
            project.is_archived ? "badge--neutral" : "badge--success"
          }`}
        >
          {project.is_archived ? "Archived" : "Active"}
        </span>
      </header>

      {project.description && (
        <p className="project-card__description">{project.description}</p>
      )}

      <dl className="card-details">
        <div>
          <dt>Client</dt>
          <dd>{project.client_name ?? "Not set"}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <span className="badge badge--outline project-card__status">
              {project.status}
            </span>
          </dd>
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
      </dl>

      <Link className="project-card__link" to={`/projects/${project.id}`}>
        View project <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

export default ProjectCard;
