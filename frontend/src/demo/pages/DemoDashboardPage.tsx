import { Link } from "react-router";

import { useDemo } from "../DemoContext";

function formatBudget(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function DemoDashboardPage() {
  const { currentUser, summary } = useDemo();

  return (
    <div className="page dashboard-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Demo overview</p>
          <h1>Dashboard</h1>
          <p className="page-header__description">
            Explore a realistic construction portfolio and see every change
            reflected instantly.
          </p>
        </div>
        <Link className="button" to="/demo/projects">
          View projects
        </Link>
      </header>

      <section
        className="dashboard-summary"
        aria-labelledby="demo-dashboard-summary-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Portfolio at a glance</p>
            <h2 id="demo-dashboard-summary-heading">Workspace summary</h2>
          </div>
        </div>

        <div className="summary-card-grid">
          <article className="summary-card summary-card--featured">
            <p className="summary-card__label">Total projects</p>
            <strong className="summary-card__value">
              {summary.total_projects}
            </strong>
            <span>Active and archived</span>
          </article>

          <article className="summary-card">
            <p className="summary-card__label">Planned projects</p>
            <strong className="summary-card__value">
              {summary.planned_projects}
            </strong>
            <span>Preparing to start</span>
          </article>

          <article className="summary-card">
            <p className="summary-card__label">Active projects</p>
            <strong className="summary-card__value">
              {summary.active_projects}
            </strong>
            <span>Currently in progress</span>
          </article>

          <article className="summary-card">
            <p className="summary-card__label">Completed projects</p>
            <strong className="summary-card__value">
              {summary.completed_projects}
            </strong>
            <span>Finished work</span>
          </article>

          <article className="summary-card">
            <p className="summary-card__label">Archived projects</p>
            <strong className="summary-card__value">
              {summary.archived_projects}
            </strong>
            <span>Read-only history</span>
          </article>

          <article className="summary-card summary-card--budget">
            <p className="summary-card__label">Total portfolio budget</p>
            <strong className="summary-card__value">
              {formatBudget(summary.total_budget)}
            </strong>
            <span>Across all projects</span>
          </article>

          <article className="summary-card summary-card--featured">
            <p className="summary-card__label">Total tasks</p>
            <strong className="summary-card__value">
              {summary.total_tasks}
            </strong>
            <span>Across the portfolio</span>
          </article>

          <article className="summary-card">
            <p className="summary-card__label">To-do tasks</p>
            <strong className="summary-card__value">
              {summary.todo_tasks}
            </strong>
            <span>Ready to begin</span>
          </article>

          <article className="summary-card">
            <p className="summary-card__label">In-progress tasks</p>
            <strong className="summary-card__value">
              {summary.in_progress_tasks}
            </strong>
            <span>Work underway</span>
          </article>

          <article className="summary-card">
            <p className="summary-card__label">Done tasks</p>
            <strong className="summary-card__value">
              {summary.done_tasks}
            </strong>
            <span>Completed work</span>
          </article>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel" aria-labelledby="demo-user-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Fictional profile</p>
              <h2 id="demo-user-heading">Demo user</h2>
            </div>
            <span className="badge badge--success">Active</span>
          </div>
          <dl className="detail-list">
            <div>
              <dt>Username</dt>
              <dd>{currentUser.username}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{currentUser.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{currentUser.role}</dd>
            </div>
          </dl>
        </section>

        <section className="panel" aria-labelledby="demo-environment-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">System</p>
              <h2 id="demo-environment-heading">Demo environment</h2>
            </div>
            <span className="status-dot">Ready</span>
          </div>
          <dl className="detail-list">
            <div>
              <dt>Status</dt>
              <dd>Ready</dd>
            </div>
            <div>
              <dt>Data source</dt>
              <dd>Browser-local demo data</dd>
            </div>
            <div>
              <dt>Version</dt>
              <dd>BuildFlow 1.0.0</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="panel panel--accent" aria-labelledby="demo-next-step-heading">
        <div>
          <p className="eyebrow">Try the workflow</p>
          <h2 id="demo-next-step-heading">Turn plans into progress</h2>
          <p>
            Create a project, add its first task, complete the work, and watch
            this dashboard update.
          </p>
        </div>
        <Link className="text-link" to="/demo/projects">
          Open demo workspace <span aria-hidden="true">&rarr;</span>
        </Link>
      </section>
    </div>
  );
}

export default DemoDashboardPage;
