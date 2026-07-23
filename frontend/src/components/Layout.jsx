import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. El-Sidebar wrapper */}
      <div className="w-full md:w-64 shrink-0">
        <Sidebar />
      </div>

      {/* 2. El-Main content (Navbar + Pages) */}
      <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden">
        <Navbar />
        
        {/* El-safahat jowa */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>

    </div>
  );
}