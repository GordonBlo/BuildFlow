import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getDashboardSummary } from "../api/dashboardApi";
import { getHealth, type HealthResponse } from "../api/healthApi";
import { useAuth } from "../auth/AuthContext";
import type { DashboardSummary } from "../types/dashboard";

function formatBudget(value: number): string {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(value);
}

function DashboardPage() {
  const { currentUser } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthErrorMessage, setHealthErrorMessage] = useState<string | null>(
    null,
  );
  const [isHealthLoading, setIsHealthLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryErrorMessage, setSummaryErrorMessage] = useState<string | null>(
    null,
  );
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHealth() {
      try {
        const response = await getHealth();

        if (isMounted) {
          setHealth(response);
        }
      } catch (error: unknown) {
        if (isMounted) {
          setHealthErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to connect to the backend.",
          );
        }
      } finally {
        if (isMounted) {
          setIsHealthLoading(false);
        }
      }
    }

    void loadHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      try {
        const response = await getDashboardSummary();

        if (isMounted) {
          setSummary(response);
        }
      } catch (error: unknown) {
        if (isMounted) {
          setSummaryErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load the Dashboard summary.",
          );
        }
      } finally {
        if (isMounted) {
          setIsSummaryLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page dashboard-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p className="page-header__description">
            Keep projects moving and confirm your workspace is connected.
          </p>
        </div>
        <Link className="button" to="/projects">
          View projects
        </Link>
      </header>

      <section
        className="dashboard-summary"
        aria-labelledby="dashboard-summary-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Portfolio at a glance</p>
            <h2 id="dashboard-summary-heading">Workspace summary</h2>
          </div>
        </div>

        {isSummaryLoading && <p role="status">Loading Dashboard summary...</p>}

        {summaryErrorMessage && (
          <p role="alert">
            Dashboard summary could not be loaded: {summaryErrorMessage}
          </p>
        )}

        {summary && (
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
              <p className="summary-card__label">Total budget</p>
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
              <span>Across owned projects</span>
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
        )}
      </section>

      <div className="dashboard-grid">
        {currentUser && (
          <section className="panel" aria-labelledby="current-user-heading">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Profile</p>
                <h2 id="current-user-heading">Your account</h2>
              </div>
              <span
                className={`badge ${
                  currentUser.is_active ? "badge--success" : "badge--neutral"
                }`}
              >
                {currentUser.is_active ? "Active" : "Inactive"}
              </span>
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
                <dt>Status</dt>
                <dd>{currentUser.is_active ? "Active" : "Inactive"}</dd>
              </div>
            </dl>
          </section>
        )}

        <section className="panel" aria-labelledby="backend-health-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">System</p>
              <h2 id="backend-health-heading">Backend health</h2>
            </div>
            {health && <span className="status-dot">Connected</span>}
          </div>

          {isHealthLoading && (
            <p role="status">Checking backend connection...</p>
          )}

          {healthErrorMessage && (
            <p role="alert">
              Backend connection failed: {healthErrorMessage}
            </p>
          )}

          {health && (
            <dl className="detail-list">
              <div>
                <dt>Status</dt>
                <dd>{health.status}</dd>
              </div>
              <div>
                <dt>Message</dt>
                <dd>{health.message}</dd>
              </div>
              <div>
                <dt>Version</dt>
                <dd>{health.version}</dd>
              </div>
            </dl>
          )}
        </section>
      </div>

      <section
        className="panel panel--accent"
        aria-labelledby="next-step-heading"
      >
        <div>
          <p className="eyebrow">Next step</p>
          <h2 id="next-step-heading">Turn plans into progress</h2>
          <p>Set up a project, define the work, and keep every task visible.</p>
        </div>
        <Link className="text-link" to="/projects">
          Open project workspace <span aria-hidden="true">&rarr;</span>
        </Link>
      </section>
    </div>
  );
}

export default DashboardPage;
