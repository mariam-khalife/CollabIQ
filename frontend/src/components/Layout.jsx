import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  // Close sidebar on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isSidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Get current page title for accessibility
  const getPageTitle = () => {
    const path = location.pathname.replace("/", "") || "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar - Desktop always visible, Mobile slides in */}
      <div className={`md:block ${isSidebarOpen ? "block" : "hidden"} md:relative`}>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        <Navbar onMenuClick={openSidebar} />

        {/* Page content with proper spacing */}
        <main 
          className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
          role="main"
          aria-label={getPageTitle()}
        >
          {/* Optional: Page header with breadcrumb could go here */}
          <div className="mb-4 md:mb-6">
            <h1 className="sr-only">{getPageTitle()}</h1>
          </div>

          {children}
        </main>

        {/* Footer (optional) */}
        <footer className="border-t border-slate-200/60 dark:border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>
              © {new Date().getFullYear()} CollabIQ. All rights reserved.
            </span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                Support
              </a>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span>v2.4.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}