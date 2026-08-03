import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getHealth, type HealthResponse } from "../api/healthApi";
import { useAuth } from "../auth/AuthContext";

function DashboardPage() {
  const { currentUser } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to connect to the backend.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadHealth();

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

          {isLoading && <p role="status">Checking backend connection...</p>}

          {errorMessage && (
            <p role="alert">Backend connection failed: {errorMessage}</p>
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
