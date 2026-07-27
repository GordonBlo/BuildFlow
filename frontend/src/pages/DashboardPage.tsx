import { useEffect, useState } from "react";

import { getHealth, type HealthResponse } from "../api/healthApi";
import { useAuth } from "../auth/AuthContext";

function DashboardPage() {
  const { currentUser, logout } = useAuth();
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
    <main>
      <h1>Dashboard</h1>

      {currentUser && (
        <section aria-labelledby="current-user-heading">
          <h2 id="current-user-heading">Your Account</h2>
          <dl>
            <dt>Username</dt>
            <dd>{currentUser.username}</dd>

            <dt>Email</dt>
            <dd>{currentUser.email}</dd>

            <dt>Status</dt>
            <dd>{currentUser.is_active ? "Active" : "Inactive"}</dd>
          </dl>
          <button type="button" onClick={logout}>
            Log out
          </button>
        </section>
      )}

      <section aria-labelledby="backend-health-heading">
        <h2 id="backend-health-heading">Backend Health</h2>

        {isLoading && <p role="status">Checking backend connection...</p>}

        {errorMessage && (
          <p role="alert">Backend connection failed: {errorMessage}</p>
        )}

        {health && (
          <dl>
            <dt>Status</dt>
            <dd>{health.status}</dd>

            <dt>Message</dt>
            <dd>{health.message}</dd>

            <dt>Version</dt>
            <dd>{health.version}</dd>
          </dl>
        )}
      </section>
    </main>
  );
}

export default DashboardPage;
