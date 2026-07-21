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
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex min-h-16 items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Mobile sidebar button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />

          <input
            type="search"
            placeholder="Search projects..."
            className="w-full rounded-xl bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-indigo-500"
            aria-label="Search projects"
          />
        </div>

        {/* Navbar actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Open notifications"
          >
            <Bell className="h-5 w-5" />

            <span
              className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            className="hidden rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 sm:block"
            aria-label="Open help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/build-team")}
            className="ml-1 whitespace-nowrap rounded-xl bg-indigo-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-800 sm:px-4 sm:text-sm"
          >
            <span className="sm:hidden">+ Team</span>
            <span className="hidden sm:inline">+ New Team</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;