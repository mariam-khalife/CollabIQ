import { useEffect, useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { getCurrentUser } from "../services/userService";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userData = await getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Unable to load current user:", error);
      }
    };

    loadCurrentUser();
  }, []);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        currentUser={currentUser}
      />

      <div className="min-h-screen md:ml-64">
        <Navbar onMenuClick={openSidebar} />

        <main className="min-w-0 overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}