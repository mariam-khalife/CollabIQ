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
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
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

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div className="p-5 space-y-8">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2">
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

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            // Checks active state (defaults active to 'My Project' for demo)
            const isActive =
              location.pathname === item.href || item.name === "My Project";

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-indigo-50/80 text-indigo-600 font-bold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {/* Active Left Indicator Line */}
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
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-100 flex items-center gap-3 bg-white">
        <img
          src="https://i.pravatar.cc/150?img=68"
          alt="Alex Chen"
          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
        />
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-slate-800 truncate leading-tight">
            Alex Chen
          </p>
          <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
            Computer Science
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;