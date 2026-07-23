import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  HelpCircle,
  User,
  Lock,
  Sun,
  Moon,
  Laptop,
  LogOut,
  Check,
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  // Account Settings State
  const [account, setAccount] = useState({
    email: "alex.chen@university.edu",
    phone: "+1 (555) 123-4567",
    isPhoneVerified: false,
  });

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: "••••••••••••",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    newInvitations: true,
    aiMatchingAlerts: true,
    messagePreviews: false,
  });

  // 1. User Choice Theme State ('light' | 'dark' | 'system')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("collabiq-theme") || "light";
  });

  // 2. Apply theme choice to DOM whenever the user selects a option
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem("collabiq-theme", theme);

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else if (theme === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (systemPrefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  // Handlers
  const handleAccountSave = (e) => {
    e.preventDefault();
    console.log("Saved account settings:", account);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    console.log("Updating password:", passwords);
  };

  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <div className="flex-1 bg-slate-50/50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header Navbar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-8 py-4 flex items-center justify-between sticky top-0 z-20 transition-colors">
        <h1 className="text-xl font-extrabold text-indigo-950 dark:text-white tracking-tight">
          Settings
        </h1>

        <div className="flex items-center gap-4">
          <button className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
            <HelpCircle className="w-5 h-5" />
          </button>

          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
            alt="Alex Chen"
            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
        </div>
      </header>

      {/* Main Settings Content */}
      <main className="max-w-5xl mx-auto p-8 space-y-6">
        {/* Account Settings */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-extrabold text-indigo-950 dark:text-white">
              Account Settings
            </h2>
          </div>

          <form onSubmit={handleAccountSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={account.email}
                  onChange={(e) =>
                    setAccount({ ...account, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  Primary contact for project invitations.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={account.phone}
                    onChange={(e) =>
                      setAccount({ ...account, phone: e.target.value })
                    }
                    className="flex-1 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setAccount({ ...account, isPhoneVerified: true })
                    }
                    className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    {account.isPhoneVerified ? "Verified" : "Verify"}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50 dark:border-slate-800">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* Security & Password */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-extrabold text-indigo-950 dark:text-white">
              Security & Password
            </h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <input
                type="password"
                placeholder="Min. 12 characters"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Update Password
              </button>
            </div>
          </form>
        </section>

        {/* Notification Preferences */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-extrabold text-indigo-950 dark:text-white">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-5 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  New Project Invitations
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  Get notified when a team wants you to join.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.newInvitations}
                onChange={() => handleToggleNotification("newInvitations")}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  AI Matching Alerts
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  Alerts when a new project matches your skill profile.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.aiMatchingAlerts}
                onChange={() => handleToggleNotification("aiMatchingAlerts")}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Message Previews
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  Show message content in browser notifications.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.messagePreviews}
                onChange={() => handleToggleNotification("messagePreviews")}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </section>

        {/* User-Selectable Interactive Appearance Cards */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="flex items-center gap-3">
            <Sun className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-extrabold text-indigo-950 dark:text-white">
              Appearance
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Light Mode Choice */}
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between space-y-3 relative ${
                theme === "light"
                  ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/30 shadow-sm scale-[1.02]"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30"
              }`}
            >
              {theme === "light" && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <div className="w-full h-24 rounded-xl border border-slate-200 bg-white flex items-center justify-center shadow-xs">
                <Sun className="w-7 h-7 text-amber-500" />
              </div>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                Light Mode
              </span>
            </button>

            {/* Dark Mode Choice */}
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between space-y-3 relative ${
                theme === "dark"
                  ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/30 shadow-sm scale-[1.02]"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30"
              }`}
            >
              {theme === "dark" && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <div className="w-full h-24 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xs">
                <Moon className="w-7 h-7 text-indigo-400" />
              </div>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                Dark Mode
              </span>
            </button>

            {/* System Default Choice */}
            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between space-y-3 relative ${
                theme === "system"
                  ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/30 shadow-sm scale-[1.02]"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30"
              }`}
            >
              {theme === "system" && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <div className="w-full h-24 rounded-xl bg-gradient-to-r from-slate-200 to-slate-800 flex items-center justify-center shadow-xs">
                <Laptop className="w-7 h-7 text-slate-600 dark:text-slate-300" />
              </div>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                System Default
              </span>
            </button>
          </div>
        </section>

        {/* Session Management */}
        <section className="bg-rose-50/30 dark:bg-rose-950/10 rounded-3xl p-8 border border-rose-100 dark:border-rose-900/30 space-y-4">
          <div className="flex items-center gap-3 text-rose-700 dark:text-rose-400">
            <LogOut className="w-5 h-5" />
            <h2 className="text-base font-extrabold">Session Management</h2>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Log Out of CollabIQ
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Securely sign out of your current academic session.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              Log Out
            </button>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-4 pb-2">
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-600">
            CollabIQ Version 2.4.0-stable | Build 2024.11.08
          </p>
        </div>
      </main>
    </div>
  );
};

export default Settings;