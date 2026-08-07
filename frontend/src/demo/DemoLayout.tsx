import { useState } from "react";
import { Link, Outlet } from "react-router";

import AppHeader from "../components/layout/AppHeader";
import Sidebar from "../components/layout/Sidebar";
import { useDemo } from "./DemoContext";

function DemoLayout() {
  const { currentUser, resetDemoData } = useDemo();
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  function handleResetDemoData() {
    if (!window.confirm("Reset all demo changes to the original sample data?")) {
      return;
    }

    resetDemoData();
    setResetMessage("Demo data has been restored to its original state.");
  }

  return (
    <div className="app-layout demo-layout">
      <Sidebar basePath="/demo" footerText="Portfolio demo" />
      <AppHeader
        currentUser={currentUser}
        accountDetail={`${currentUser.role} - ${currentUser.email}`}
        contextEyebrow="Demo mode"
        contextTitle="Browser-local workspace"
        action={<span className="demo-mode-badge">Demo mode</span>}
      />
      <main className="app-main" id="main-content">
        <div className="content-container">
          <aside className="demo-notice" aria-label="Demo environment notice">
            <div className="demo-notice__copy">
              <strong>Interactive portfolio demo</strong>
              <span>
                Sample data and your changes stay in this browser. No account,
                API, database, or token is used.
              </span>
            </div>
            <div className="demo-notice__actions">
              <button
                className="button button--secondary button--compact"
                type="button"
                onClick={handleResetDemoData}
              >
                Reset demo data
              </button>
              <Link className="button button--compact" to="/login">
                Open real app
              </Link>
            </div>
          </aside>

          {resetMessage && <p role="status">{resetMessage}</p>}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DemoLayout;
