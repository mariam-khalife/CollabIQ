import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import AiMatching from "./pages/AiMatching";
import TeamManagement from "./pages/TeamManagement";
import Notifications from "./pages/Notifications";
import MyProjects from "./pages/MyProjects";
import Reputation from "./pages/Reputation";
import Settings from "./pages/Settings";

import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Public authentication pages */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Pages using the global layout */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <MyProfile />
            </Layout>
          }
        />

        <Route
          path="/ai-matching"
          element={
            <Layout>
              <AiMatching />
            </Layout>
          }
        />

        <Route
          path="/team-management"
          element={
            <Layout>
              <TeamManagement />
            </Layout>
          }
        />

        <Route
          path="/notifications"
          element={
            <Layout>
              <Notifications />
            </Layout>
          }
        />

        <Route
          path="/my-projects"
          element={
            <Layout>
              <MyProjects />
            </Layout>
          }
        />

        <Route
          path="/reputation"
          element={
            <Layout>
              <Reputation />
            </Layout>
          }
        />

        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;