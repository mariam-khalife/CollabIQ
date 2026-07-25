import React, { useState } from "react";
import {
  Bell,
  HelpCircle,
  Menu,
  Search,
  User,
  ChevronDown,
  Sparkles,
  Moon,
  Sun,
  LogOut,
  Settings,
  UserCircle,
  X,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../ThemeProvider";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      // Clear tokens
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("access_token");
      navigate("/login");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const user = {
    name: "Alex Chen",
    email: "alex.chen@university.edu",
    avatar: "https://i.pravatar.cc/150?img=68",
    role: "Computer Science",
  };

  return (
    <header className="min-h-[64px] border-b border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 sm:px-8 flex items-center justify-between gap-4 py-2 sm:py-0 shrink-0 sticky top-0 z-30 transition-colors duration-200">
      
      {/* Left Section: Logo & Menu */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 md:hidden transition-all"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Logo */}
        <Link to="/dashboard" className="hidden md:flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            CollabIQ
          </span>
        </Link>
      </div>

      {/* Search Box */}
      <div className={`relative flex-1 max-w-md transition-all duration-200 ${
        isSearchFocused ? "scale-[1.02]" : "scale-100"
      }`}>
        <Search
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
            isSearchFocused ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
          }`}
          size={17}
        />
        <input
          type="search"
          placeholder="Search projects, teams, or members..."
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className={`w-full bg-slate-100/70 dark:bg-slate-800/70 pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-200 ${
            isSearchFocused 
              ? "ring-2 ring-indigo-500/20 bg-white dark:bg-slate-800 shadow-lg shadow-indigo-500/10" 
              : "border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
          }`}
          aria-label="Search projects"
        />
        
        {/* Keyboard shortcut hint */}
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-200/50 dark:bg-slate-700/50 px-1.5 py-0.5 rounded-md border border-slate-300 dark:border-slate-600">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:text-slate-900 dark:hover:text-slate-200"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} className="text-slate-600" />
          )}
        </button>

        {/* Help Button */}
        <button
          type="button"
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:text-slate-900 dark:hover:text-slate-200 hidden sm:flex"
          aria-label="Open help"
        >
          <HelpCircle size={18} />
        </button>

        {/* Notifications Button */}
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:text-slate-900 dark:hover:text-slate-200"
          aria-label="Open notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse-soft" />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
            aria-label="User menu"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:border-indigo-400 dark:group-hover:border-indigo-500 transition-colors"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div className="hidden lg:flex flex-col items-start">
              <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {user.role}
              </span>
            </div>
            <ChevronDown 
              size={14} 
              className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`} 
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800 py-2 animate-slide-in z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <UserCircle size={16} className="text-slate-400 dark:text-slate-500" />
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings size={16} className="text-slate-400 dark:text-slate-500" />
                  Settings
                </Link>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 dark:border-slate-800"></div>

              {/* Logout */}
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <button
          type="button"
          onClick={() => navigate("/build-team")}
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
        >
          <Sparkles size={14} />
          New Team
        </button>
      </div>

      {/* Mobile Quick Action */}
      <button
        type="button"
        onClick={() => navigate("/build-team")}
        className="sm:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3.5 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all active:scale-95"
        aria-label="Create new team"
      >
        <Sparkles size={20} />
      </button>
    </header>
  );
}

export default Navbar;