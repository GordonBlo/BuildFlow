import { Navigate, Outlet, Route, Routes } from "react-router";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import ProjectsPage from "./pages/ProjectsPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import { AuthProvider } from "./auth/AuthContext";
import DemoLayout from "./demo/DemoLayout";
import { DemoProvider } from "./demo/DemoContext";
import DemoDashboardPage from "./demo/pages/DemoDashboardPage";
import DemoProjectDetailsPage from "./demo/pages/DemoProjectDetailsPage";
import DemoProjectsPage from "./demo/pages/DemoProjectsPage";

function RealAppProvider() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

function App() {
  const isDemoBuild = import.meta.env.MODE === "demo";

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={isDemoBuild ? "/demo/dashboard" : "/login"}
            replace
          />
        }
      />
      <Route
        path="demo"
        element={
          <DemoProvider>
            <DemoLayout />
          </DemoProvider>
        }
      >
        <Route index element={<Navigate to="/demo/dashboard" replace />} />
        <Route path="dashboard" element={<DemoDashboardPage />} />
        <Route path="projects" element={<DemoProjectsPage />} />
        <Route
          path="projects/:projectId"
          element={<DemoProjectDetailsPage />}
        />
      </Route>
      <Route element={<RealAppProvider />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
