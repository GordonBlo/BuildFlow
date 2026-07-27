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
    <article>
      <header>
        <h2>
          <Link to={`/projects/${project.id}`}>{project.name}</Link>
        </h2>
        <p>{project.is_archived ? "Archived" : "Active"}</p>
      </header>

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
      </dl>
    </article>
  );
}

export default ProjectCard;
