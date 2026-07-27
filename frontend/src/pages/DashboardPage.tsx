import { useEffect, useState } from "react";

import { getHealth, type HealthResponse } from "../api/healthApi";

function DashboardPage() {
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
