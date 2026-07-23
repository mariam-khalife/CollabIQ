import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  UserPlus,
  Brain,
  Users,
  Lightbulb,
  Rocket,
  Bell,
  Award,
  Settings,
  X,
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/profile", icon: User },
  { name: "Build New Team", href: "/build-team", icon: UserPlus },
  { name: "AI Team Matching", href: "/ai-matching", icon: Brain },
  { name: "Team Management", href: "/team-management", icon: Users },
  { name: "AI Project Suggestions", href: "/ai-suggestions", icon: Lightbulb },
  { name: "My Project", href: "/my-projects", icon: Rocket },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Reputation", href: "/reputation", icon: Award },
  { name: "Settings", href: "/settings", icon: Settings },
];

function Sidebar({ isOpen, onClose }) {
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-slate-100 bg-white p-5 select-none transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col min-h-0 flex-1 space-y-6">
          {/* Logo & Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-100 shrink-0">
                <Rocket className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-800 leading-tight tracking-tight">
                  CollabIQ
                </h1>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
                  Academic Excellence
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:hidden"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-indigo-50/80 text-indigo-600 font-bold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator Line */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-600 rounded-r-full" />
                      )}

                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? "text-indigo-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          <NavLink
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 p-1.5 rounded-xl transition-colors hover:bg-slate-50 group"
          >
            <img
              src="https://i.pravatar.cc/150?img=68"
              alt="Alex Chen"
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate leading-tight group-hover:text-indigo-600 transition-colors">
                Alex Chen
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                Computer Science
              </p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;