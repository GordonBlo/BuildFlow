import { Outlet, useNavigate } from "react-router";

import { useAuth } from "../../auth/AuthContext";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";

function AppLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <AppHeader currentUser={currentUser} onLogout={handleLogout} />
      <main className="app-main" id="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
