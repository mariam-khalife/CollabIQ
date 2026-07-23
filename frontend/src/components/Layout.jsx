import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden md:ml-64">
        <Navbar onMenuClick={openSidebar} />

        <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}