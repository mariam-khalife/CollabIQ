import {
  Bell,
  HelpCircle,
  Menu,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <header className="min-h-[64px] border-b border-slate-200 bg-white px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 py-3 sm:py-0 shrink-0 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="self-start rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      {/* Search Box */}
      <div className="relative w-full sm:w-72 md:w-96 order-2 sm:order-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        <input
          type="search"
          placeholder="Search projects..."
          className="w-full bg-[#F1F5F9] pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Search projects"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto order-1 sm:order-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className="relative p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            aria-label="Open notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>

          <button
            type="button"
            className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors hidden sm:block"
            aria-label="Open help"
          >
            <HelpCircle size={20} />
          </button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/build-team")}
          className="bg-[#312E81] text-white text-[11px] sm:text-xs px-3 sm:px-4 py-2 rounded-xl hover:bg-indigo-900 transition-colors whitespace-nowrap shadow-sm"
        >
          <span className="sm:hidden">+ Team</span>
          <span className="hidden sm:inline">+ New Team</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;