import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    // md:flex-row bikhallihon yimsho 7add ba3ed absolute mratab 3al-desktop min doun overlaps
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      
      {/* 1. El-Sidebar wrapper (shrinking disabled kirmal ma yindaghat) */}
      <div className="w-full md:w-64 shrink-0">
        <Sidebar />
      </div>

      {/* 2. El-Main content (Navbar + Pages) */}
      {/* min-w-0 hye l-sirr kirmal ma yfout l-Navbar bel-sidebar! */}
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