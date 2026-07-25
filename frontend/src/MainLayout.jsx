import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
// Import whatever icons you are using in your original sidebar here

export default function MainLayout() {
  const location = useLocation();
  
  // Helper to check active state if you want to highlight links dynamically
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      
      {/* 1. PASTE YOUR EXACT EXISTING SIDEBAR CODE HERE */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
        {/* Your logo, menu list, and user footer profile go here */}
        <nav className="space-y-1">
          <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 text-[14px] rounded-xl ${isActive('/dashboard') ? 'bg-[#EEF2FF] text-[#4f46E5] font-semibold' : 'text-slate-500'}`}>
            Dashboard
          </Link>
          <Link to="/profile" className={`flex items-center gap-3 px-4 py-3 text-[14px] rounded-xl ${isActive('/profile') ? 'bg-[#EEF2FF] text-[#4f46E5] font-semibold' : 'text-slate-500'}`}>
            My Profile
          </Link>
        </nav>
      </aside>
      
      {/* 2. MAIN WINDOW WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* PASTE YOUR EXACT EXISTING HEADER/NAVBAR CODE HERE */}
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0">
          {/* Your search box and top-right notification icons go here */}
        </header>

        {/* 3. THIS IS THE MAGIC PORTAL */}
        {/* React Router will inject your Dashboard or Profile view right here inside the main page padding */}
        <main className="p-8 space-y-6 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>

    </div>
  );
}