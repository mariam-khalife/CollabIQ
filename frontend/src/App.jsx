import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout Wrapper
import MainLayout from "./MainLayout"; // or "./components/Layout" based on your preference

// Public Page
import Landing from "./pages/Landing";

// Page Components
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import BuildTeam from "./pages/BuildTeam";
import AiMatching from "./pages/AiMatching";
import TeamManagement from "./pages/TeamManagement";
import AiSuggestions from "./pages/AiSuggestions";
import MyProjects from "./pages/MyProjects";
import Notifications from "./pages/Notifications";
import Reputation from "./pages/Reputation";
import Settings from "./pages/Settings";

// Auth Pages (Rendered outside the layout)
import Login from "./pages/login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Public / Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main Application Routes Wrapped in Layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/build-team" element={<BuildTeam />} />
          <Route path="/ai-matching" element={<AiMatching />} />
          <Route path="/team-management" element={<TeamManagement />} />
          <Route path="/ai-suggestions" element={<AiSuggestions />} />
          <Route path="/my-projects" element={<MyProjects />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reputation" element={<Reputation />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;