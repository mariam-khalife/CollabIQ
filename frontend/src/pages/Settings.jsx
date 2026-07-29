import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarClock,
  Check,
  Laptop,
  Lock,
  LogOut,
  Moon,
  Sun,
  User,
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("collabiq-theme") || "light";
  });

  const [account, setAccount] = useState({
    email: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    teamInvitations: true,
    taskAssignments: true,
    deadlineAlerts: true,
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [accountSaved, setAccountSaved] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    localStorage.setItem("collabiq-theme", theme);

    if (theme === "dark") {
      root.classList.add("dark");
      return;
    }

    if (theme === "light") {
      root.classList.remove("dark");
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    root.classList.toggle("dark", prefersDark);
  }, [theme]);

  const handleAccountSave = (event) => {
    event.preventDefault();

    setAccountSaved(true);

    setTimeout(() => {
      setAccountSaved(false);
    }, 3000);
  };

  const handlePasswordUpdate = (event) => {
    event.preventDefault();

    const errors = {};

    if (!passwords.currentPassword) {
      errors.currentPassword = "Current password is required.";
    }

    if (passwords.newPassword.length < 8) {
      errors.newPassword =
        "New password must contain at least 8 characters.";
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setPasswordUpdated(true);

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setTimeout(() => {
      setPasswordUpdated(false);
    }, 3000);
  };

  const handleToggleNotification = (key) => {
    setNotifications((currentPreferences) => ({
      ...currentPreferences,
      [key]: !currentPreferences[key],
    }));
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("access_token");
    sessionStorage.removeItem("access_token");

    navigate("/login");
  };

  const notificationOptions = [
    {
      key: "teamInvitations",
      title: "Team Invitations",
      description:
        "Receive an alert when another user invites you to join a team.",
      icon: Bell,
    },
    {
      key: "taskAssignments",
      title: "Task Assignments",
      description:
        "Receive an alert when a task is assigned to you.",
      icon: Check,
    },
    {
      key: "deadlineAlerts",
      title: "Task Deadline Alerts",
      description:
        "Receive reminders when assigned tasks are approaching their deadlines.",
      icon: CalendarClock,
    },
  ];

  return (
    <div className="min-h-full text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-6xl space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your account, security, notification preferences, and
            appearance.
          </p>
        </div>

        {/* Account */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2 dark:bg-indigo-950/50">
              <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Account
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Update your primary account email.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleAccountSave}
            className="mt-6 max-w-2xl space-y-5"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email address
              </label>

              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={account.email}
                onChange={(event) =>
                  setAccount({
                    ...account,
                    email: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-indigo-950"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                This email is used for account access and project
                invitations.
              </p>
            </div>

            {accountSaved && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                <Check className="h-4 w-4" />
                Account settings saved successfully.
              </div>
            )}

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </form>
        </section>

        {/* Security */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2 dark:bg-indigo-950/50">
              <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Security
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Change your password and protect your account.
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePasswordUpdate}
            className="mt-6 max-w-2xl space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Current password
              </label>

              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(event) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: event.target.value,
                  })
                }
                className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-slate-800 dark:text-slate-200 ${
                  passwordErrors.currentPassword
                    ? "border-rose-400"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              />

              {passwordErrors.currentPassword && (
                <p className="mt-1 text-xs text-rose-500">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                New password
              </label>

              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={passwords.newPassword}
                onChange={(event) =>
                  setPasswords({
                    ...passwords,
                    newPassword: event.target.value,
                  })
                }
                className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-slate-800 dark:text-slate-200 ${
                  passwordErrors.newPassword
                    ? "border-rose-400"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              />

              {passwordErrors.newPassword && (
                <p className="mt-1 text-xs text-rose-500">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm new password
              </label>

              <input
                type="password"
                placeholder="Confirm the new password"
                value={passwords.confirmPassword}
                onChange={(event) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: event.target.value,
                  })
                }
                className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-slate-800 dark:text-slate-200 ${
                  passwordErrors.confirmPassword
                    ? "border-rose-400"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              />

              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-500">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            {passwordUpdated && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                <Check className="h-4 w-4" />
                Password updated successfully.
              </div>
            )}

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Update Password
            </button>
          </form>
        </section>

        {/* Notification preferences */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2 dark:bg-indigo-950/50">
              <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Notification Preferences
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose which platform alerts you want to receive.
              </p>
            </div>
          </div>

          <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
            {notificationOptions.map((option) => {
              const Icon = option.icon;
              const enabled = notifications[option.key];

              return (
                <div
                  key={option.key}
                  className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {option.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs text-slate-400">
                      {enabled ? "On" : "Off"}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleNotification(option.key)
                      }
                      role="switch"
                      aria-checked={enabled}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        enabled
                          ? "bg-indigo-600"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                          enabled
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Appearance */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2 dark:bg-indigo-950/50">
              <Sun className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Appearance
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose how CollabIQ appears on your device.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                value: "light",
                label: "Light",
                icon: Sun,
              },
              {
                value: "dark",
                label: "Dark",
                icon: Moon,
              },
              {
                value: "system",
                label: "System",
                icon: Laptop,
              },
            ].map((option) => {
              const Icon = option.icon;
              const selected = theme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className={`relative flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <div className="rounded-xl bg-white p-2 shadow-sm dark:bg-slate-900">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-sm font-semibold">
                    {option.label}
                  </span>

                  {selected && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Session */}
        <section className="rounded-3xl border border-rose-200 bg-rose-50/40 p-6 dark:border-rose-900/40 dark:bg-rose-950/10 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-rose-100 p-2 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                <LogOut className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-rose-700 dark:text-rose-400">
                  Session
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Securely sign out of your CollabIQ account.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
            >
              Log Out
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;