import {
  LayoutDashboard,
  User,
  Users,
  Rocket,
  Award,
  Settings,
  Bell,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Profile",
    path: "/profile",
    icon: User,
  },
  {
    label: "Team Management",
    path: "/team-management",
    icon: Users,
  },
  {
    label: "AI Team Matching",
    path: "/ai-matching",
    icon: Users,
  },
  {
    label: "My Projects",
    path: "/my-projects",
    icon: Rocket,
  },
  {
    label: "Reputation",
    path: "/reputation",
    icon: Award,
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar({ isOpen, onClose }) {
  const linkClassName = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
    }`;

  return (
    <>
      {/* Mobile background overlay */}
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
          aria-label="Close navigation menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white p-6 transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Logo */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                CollabIQ
              </h1>

              <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Academic Excellence
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 md:hidden"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={linkClassName}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Current user */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <NavLink
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-100"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                U
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  Current User
                </p>

                <p className="truncate text-xs text-slate-400">
                  View profile
                </p>
              </div>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;