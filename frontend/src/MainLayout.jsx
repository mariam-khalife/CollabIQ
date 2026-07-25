import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "./components/Sidebar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  // Close sidebar on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Get page title from pathname
  const getPageTitle = () => {
    const path = location.pathname.replace("/", "") || "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 relative">
      {/* Sidebar - Desktop always visible, Mobile slides in */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Overlay for mobile - closes sidebar when clicking outside */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 transition-all duration-300">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
            <h1 className="text-lg font-extrabold text-indigo-950 dark:text-white tracking-tight">
              CollabIQ
            </h1>
          </div>

          {/* Optional: Add user avatar or actions here */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden xs:block">
              {getPageTitle()}
            </span>
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
              U
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}