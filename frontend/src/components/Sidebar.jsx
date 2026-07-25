import React from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  Sparkles,
  ChevronRight,
  LogOut,
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

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();

  // Check if a route is active (including nested routes)
  const isRouteActive = (href) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href) && href !== "/dashboard";
  };

  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-200/60 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-5 select-none transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0 md:h-screen md:shadow-none shadow-2xl shrink-0`}
      >
        <div className="flex flex-col min-h-0 flex-1 space-y-6">
          {/* Logo & Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Rocket className="w-5 h-5 fill-current" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                  CollabIQ
                </h1>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Academic Excellence
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-all"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-0.5 overflow-y-auto pr-1 custom-scrollbar">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isRouteActive(item.href);

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={handleNavigation}
                  className={({ isActive: navLinkActive }) =>
                    `relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                      isActive || navLinkActive
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                    }`
                  }
                >
                  {({ isActive: navLinkActive }) => {
                    const active = isActive || navLinkActive;
                    return (
                      <>
                        {/* Active Indicator Line */}
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-r-full shadow-sm shadow-indigo-500/30" />
                        )}

                        <Icon
                          className={`w-4.5 h-4.5 shrink-0 transition-all ${
                            active
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                          } ${active ? "scale-110" : "group-hover:scale-105"}`}
                        />
                        <span className="truncate">{item.name}</span>

                        {/* AI Badge for specific items */}
                        {(item.name === "AI Team Matching" || 
                          item.name === "AI Project Suggestions") && (
                          <span className="ml-auto px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md">
                            AI
                          </span>
                        )}

                        {/* Notification dot */}
                        {item.name === "Notifications" && (
                          <span className="ml-auto w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse-soft" />
                        )}

                        {/* Active arrow indicator */}
                        {active && (
                          <ChevronRight className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-500 ml-auto" />
                        )}
                      </>
                    );
                  }}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 mt-auto">
          <NavLink
            to="/profile"
            onClick={handleNavigation}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-950/50"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
              } group`
            }
          >
            <div className="relative">
              <img
                src="https://i.pravatar.cc/150?img=68"
                alt="Alex Chen"
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:border-indigo-300 dark:group-hover:border-indigo-600 transition-colors"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div className="overflow-hidden min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Alex Chen
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Computer Science
              </p>
            </div>
            <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </NavLink>

          {/* Logout Button */}
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to log out?")) {
                // Handle logout logic
                console.log("Logging out...");
              }
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 mt-2 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all group"
          >
            <LogOut className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;