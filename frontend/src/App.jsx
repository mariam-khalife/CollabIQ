import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Layout Wrapper
import MainLayout from "./MainLayout";

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

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

// Document title updater
function UpdateTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageName = pathname === "/" 
      ? "Home" 
      : pathname.replace("/", "").charAt(0).toUpperCase() + 
        pathname.replace("/", "").slice(1).replace("-", " ");
    
    document.title = `CollabIQ${pageName !== "Home" ? ` | ${pageName}` : ""}`;
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <UpdateTitle />
      
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Public / Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main Application Routes (protected) */}
        <Route element={<MainLayout />}>
          {/* Redirect /app to dashboard */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          
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

        {/* 404 - Redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;