import React, { useState, useEffect } from "react";
import { useTheme } from "../ThemeProvider";
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
  Shield,
  Smartphone,
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Account Settings State
  const [account, setAccount] = useState({
    email: "alex.chen@university.edu",
    phone: "+1 (555) 123-4567",
    isPhoneVerified: false,
  });

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    newInvitations: true,
    aiMatchingAlerts: true,
    messagePreviews: false,
  });

  // Form validation states
  const [passwordErrors, setPasswordErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Handlers
  const handleAccountSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    console.log("Saved account settings:", account);
    
    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    const errors = {};
    
    if (passwords.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    setPasswordErrors({});
    setPasswordSuccess(true);
    console.log("Updating password:", passwords);
    
    // Reset password fields
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    
    // Hide success message after 3 seconds
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      console.log("Logging out...");
      // Clear any auth tokens if needed
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("access_token");
      navigate("/login");
    }
  };

  return (
    <div className="flex-1 bg-slate-50/50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-y-auto">
      {/* Top Header Navbar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 transition-colors">
        <h1 className="text-xl font-extrabold text-indigo-950 dark:text-white tracking-tight">
          Settings
        </h1>

        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          <button 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            aria-label="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
              alt="Alex Chen"
              className="w-8 h-8 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
            />
            <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-300">
              Alex Chen
            </span>
          </div>
        </div>
      </header>

      {/* Main Settings Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Account Settings */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-colors hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
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
                  className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-800 transition-all"
                  required
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
                    type="tel"
                    value={account.phone}
                    onChange={(e) =>
                      setAccount({ ...account, phone: e.target.value })
                    }
                    className="flex-1 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setAccount({ ...account, isPhoneVerified: true })
                    }
                    className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 ${
                      account.isPhoneVerified
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                    }`}
                  >
                    {account.isPhoneVerified ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {saveSuccess && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4" />
                Account settings saved successfully!
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* Security & Password */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-colors hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
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
                className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-800 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className={`w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-800 transition-all ${
                  passwordErrors.newPassword
                    ? "border-rose-400 dark:border-rose-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
                required
              />
              {passwordErrors.newPassword && (
                <p className="text-rose-500 dark:text-rose-400 text-[10px] font-medium mt-1">
                  {passwordErrors.newPassword}
                </p>
              )}
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
                className={`w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-800 transition-all ${
                  passwordErrors.confirmPassword
                    ? "border-rose-400 dark:border-rose-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
                required
              />
              {passwordErrors.confirmPassword && (
                <p className="text-rose-500 dark:text-rose-400 text-[10px] font-medium mt-1">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            {passwordSuccess && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4" />
                Password updated successfully!
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                Update Password
              </button>
            </div>
          </form>
        </section>

        {/* Notification Preferences */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-colors hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
              <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-base font-extrabold text-indigo-950 dark:text-white">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-5 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  New Project Invitations
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  Get notified when a team wants you to join.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-medium">
                  {notifications.newInvitations ? "On" : "Off"}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleNotification("newInvitations")}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                    notifications.newInvitations
                      ? "bg-indigo-600"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                  role="switch"
                  aria-checked={notifications.newInvitations}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      notifications.newInvitations
                        ? "translate-x-5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  AI Matching Alerts
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  Alerts when a new project matches your skill profile.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-medium">
                  {notifications.aiMatchingAlerts ? "On" : "Off"}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleNotification("aiMatchingAlerts")}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                    notifications.aiMatchingAlerts
                      ? "bg-indigo-600"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                  role="switch"
                  aria-checked={notifications.aiMatchingAlerts}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      notifications.aiMatchingAlerts
                        ? "translate-x-5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Message Previews
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  Show message content in browser notifications.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-medium">
                  {notifications.messagePreviews ? "On" : "Off"}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleNotification("messagePreviews")}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                    notifications.messagePreviews
                      ? "bg-indigo-600"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                  role="switch"
                  aria-checked={notifications.messagePreviews}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      notifications.messagePreviews
                        ? "translate-x-5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-colors hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
              <Sun className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-base font-extrabold text-indigo-950 dark:text-white">
              Appearance
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Light Mode Choice */}
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between space-y-3 relative group ${
                theme === "light"
                  ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/30 shadow-sm scale-[1.02]"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              }`}
            >
              {theme === "light" && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-sm">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <div className={`w-full h-24 rounded-xl border border-slate-200 flex items-center justify-center shadow-xs transition-all ${
                theme === "light" ? "bg-white" : "bg-white/80"
              }`}>
                <Sun className={`w-7 h-7 transition-colors ${
                  theme === "light" ? "text-amber-500" : "text-slate-400"
                }`} />
              </div>
              <span className={`text-xs font-extrabold transition-colors ${
                theme === "light" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-200"
              }`}>
                Light Mode
              </span>
            </button>

            {/* Dark Mode Choice */}
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between space-y-3 relative group ${
                theme === "dark"
                  ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/30 shadow-sm scale-[1.02]"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              }`}
            >
              {theme === "dark" && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-sm">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <div className={`w-full h-24 rounded-xl border border-slate-800 flex items-center justify-center shadow-xs transition-all ${
                theme === "dark" ? "bg-slate-900" : "bg-slate-800/50"
              }`}>
                <Moon className={`w-7 h-7 transition-colors ${
                  theme === "dark" ? "text-indigo-400" : "text-slate-400"
                }`} />
              </div>
              <span className={`text-xs font-extrabold transition-colors ${
                theme === "dark" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-200"
              }`}>
                Dark Mode
              </span>
            </button>

            {/* System Default Choice */}
            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between space-y-3 relative group ${
                theme === "system"
                  ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/30 shadow-sm scale-[1.02]"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              }`}
            >
              {theme === "system" && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-sm">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <div className={`w-full h-24 rounded-xl flex items-center justify-center shadow-xs transition-all ${
                theme === "system" 
                  ? "bg-gradient-to-r from-slate-200 to-slate-800" 
                  : "bg-gradient-to-r from-slate-200/50 to-slate-800/50"
              }`}>
                <Laptop className={`w-7 h-7 transition-colors ${
                  theme === "system" ? "text-white" : "text-slate-400"
                }`} />
              </div>
              <span className={`text-xs font-extrabold transition-colors ${
                theme === "system" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-200"
              }`}>
                System Default
              </span>
            </button>
          </div>
        </section>

        {/* Session Management */}
        <section className="bg-rose-50/30 dark:bg-rose-950/10 rounded-3xl p-6 sm:p-8 border border-rose-100 dark:border-rose-900/30 space-y-4 transition-colors">
          <div className="flex items-center gap-3 text-rose-700 dark:text-rose-400">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
              <LogOut className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold">Session Management</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 gap-4">
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
              className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95 w-full sm:w-auto"
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