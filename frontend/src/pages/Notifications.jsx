import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  Award,
  Bell,
  Brain,
  CheckCheck,
  ChevronRight,
  ClipboardList,
  Search,
  UserPlus,
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "ai_insight",
      group: "TODAY",
      title: "AI Collaboration Insight",
      time: "2m ago",
      isUnread: true,
      category: "insight",
      icon: Brain,
      iconBg:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      content: (
        <>
          Based on your recent research in{" "}
          <strong className="font-bold text-slate-900 dark:text-white">
            Neural Networks
          </strong>
          , we found 3 potential teammates in your department with matching
          skillsets.
        </>
      ),
      actions: [
        {
          label: "View Matches",
          variant: "primary",
          action: "view_matches",
        },
        {
          label: "Dismiss",
          variant: "text",
          action: "dismiss",
        },
      ],
    },
    {
      id: "2",
      type: "invitation",
      group: "TODAY",
      title: 'Team Invitation: "Ethical AI Summit"',
      time: "15m ago",
      isUnread: true,
      category: "invitation",
      icon: UserPlus,
      iconBg:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      content: (
        <>
          <strong className="font-bold text-slate-900 dark:text-white">
            Sarah Jenkins
          </strong>{" "}
          invited you to join their project team as a{" "}
          <strong className="font-bold text-indigo-600 dark:text-indigo-400">
            Lead Developer
          </strong>
          .
        </>
      ),
      actions: [
        {
          label: "Accept",
          variant: "primary",
          action: "accept",
        },
        {
          label: "Decline",
          variant: "secondary",
          action: "decline",
        },
      ],
    },
    {
      id: "3",
      type: "task",
      group: "TODAY",
      title: "New Task Assigned",
      time: "2h ago",
      isUnread: false,
      category: "task",
      icon: ClipboardList,
      iconBg:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      content: (
        <>
          You have been assigned the task{" "}
          <em className="font-semibold text-slate-800 dark:text-slate-200">
            "Draft Project Abstract"
          </em>{" "}
          by{" "}
          <strong className="font-bold text-slate-900 dark:text-white">
            Prof. Marcus Miller
          </strong>
          .
        </>
      ),
      actions: [
        {
          label: "Open Task Board",
          variant: "link",
          action: "open_task",
        },
      ],
    },
    {
      id: "4",
      type: "alert",
      group: "YESTERDAY",
      title: "Deadline Approaching",
      time: "23h ago",
      isUnread: true,
      category: "alert",
      icon: AlertCircle,
      iconBg:
        "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
      content: (
        <>
          The final submission for{" "}
          <strong className="font-bold text-slate-900 dark:text-white">
            Capstone Project Phase 1
          </strong>{" "}
          is due in{" "}
          <strong className="font-bold text-rose-600 dark:text-rose-400">
            24 hours
          </strong>
          .
        </>
      ),
      actions: [
        {
          label: "Submit Now",
          variant: "soft-secondary",
          action: "submit",
        },
      ],
    },
    {
      id: "5",
      type: "reputation",
      group: "YESTERDAY",
      title: "Reputation Gained",
      time: "1d ago",
      isUnread: false,
      category: "reputation",
      icon: Award,
      iconBg:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      content: (
        <>
          Your contribution to the{" "}
          <strong className="font-bold text-slate-900 dark:text-white">
            Open Source ML Kit
          </strong>{" "}
          was highly rated. You earned{" "}
          <strong className="font-bold text-emerald-600 dark:text-emerald-400">
            +50 Reputation Points
          </strong>
          .
        </>
      ),
      actions: [
        {
          label: "View Badge Gallery",
          variant: "link",
          action: "view_badges",
        },
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.isUnread).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        notification.title.toLowerCase().includes(normalizedQuery);

      if (!matchesSearch) {
        return false;
      }

      if (activeTab === "Unread") {
        return notification.isUnread;
      }

      if (activeTab === "Invitations") {
        return notification.category === "invitation";
      }

      return true;
    });
  }, [activeTab, notifications, searchQuery]);

  const groupedNotifications = useMemo(() => {
    return filteredNotifications.reduce((groups, notification) => {
      if (!groups[notification.group]) {
        groups[notification.group] = [];
      }

      groups[notification.group].push(notification);
      return groups;
    }, {});
  }, [filteredNotifications]);

  const handleMarkAllRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isUnread: false,
      }))
    );
  };

  const handleAction = (id, actionType) => {
    if (
      actionType === "dismiss" ||
      actionType === "accept" ||
      actionType === "decline"
    ) {
      setNotifications((currentNotifications) =>
        currentNotifications.filter(
          (notification) => notification.id !== id
        )
      );

      return;
    }

    console.log(`Action executed: ${actionType} for notification ${id}`);
  };

  const getGroupLabel = (group) => {
    if (group === "TODAY") {
      return "Today";
    }

    if (group === "YESTERDAY") {
      return "Yesterday";
    }

    return group;
  };

  const renderActions = (notification) => {
    return notification.actions?.map((button) => {
      const key = `${notification.id}-${button.action}`;
      const baseClasses =
        "rounded-lg px-4 py-2 text-xs font-semibold transition-colors";

      if (button.variant === "primary") {
        return (
          <button
            key={key}
            type="button"
            onClick={() =>
              handleAction(notification.id, button.action)
            }
            className={`${baseClasses} bg-indigo-600 text-white hover:bg-indigo-700`}
          >
            {button.label}
          </button>
        );
      }

      if (button.variant === "secondary") {
        return (
          <button
            key={key}
            type="button"
            onClick={() =>
              handleAction(notification.id, button.action)
            }
            className={`${baseClasses} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700`}
          >
            {button.label}
          </button>
        );
      }

      if (button.variant === "soft-secondary") {
        return (
          <button
            key={key}
            type="button"
            onClick={() =>
              handleAction(notification.id, button.action)
            }
            className={`${baseClasses} bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700`}
          >
            {button.label}
          </button>
        );
      }

      if (button.variant === "text") {
        return (
          <button
            key={key}
            type="button"
            onClick={() =>
              handleAction(notification.id, button.action)
            }
            className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {button.label}
          </button>
        );
      }

      if (button.variant === "link") {
        return (
          <button
            key={key}
            type="button"
            onClick={() =>
              handleAction(notification.id, button.action)
            }
            className="group flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {button.label}
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        );
      }

      return null;
    });
  };

  return (
    <div className="min-h-full text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-6xl space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {unreadCount} new
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review team invitations, assigned tasks, deadlines, and
              reputation updates.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-950"
            />
          </div>
        </div>

        {/* Filters and actions */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Unread", "Invitations"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                {tab}

                {tab === "Unread" && unreadCount > 0 && (
                  <span
                    className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] ${
                      activeTab === tab
                        ? "bg-white/20 text-white"
                        : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 self-start rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-800 sm:self-auto dark:text-indigo-400 dark:hover:bg-indigo-950/30"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notification count */}
        <div className="flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between dark:text-slate-500">
          <span>
            Showing {filteredNotifications.length} of {notifications.length}{" "}
            notification
            {notifications.length !== 1 ? "s" : ""}
          </span>

          {searchQuery && (
            <span>
              Search:{" "}
              <span className="font-medium text-slate-500 dark:text-slate-400">
                “{searchQuery}”
              </span>
            </span>
          )}
        </div>

        {/* Notification list */}
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 py-16 text-center dark:border-slate-700">
            <div className="mb-4 inline-flex rounded-full bg-slate-100 p-4 dark:bg-slate-800">
              <Bell className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {searchQuery
                ? "No notifications match your search."
                : "No notifications found."}
            </p>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-3 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([group, items]) => (
            <section key={group} className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {getGroupLabel(group)}
                </h2>

                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />

                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {items.map((notification) => {
                  const Icon = notification.icon;
                  const isAlert = notification.type === "alert";

                  return (
                    <article
                      key={notification.id}
                      className={`relative flex flex-col items-start gap-4 rounded-2xl border p-5 sm:flex-row ${
                        notification.isUnread
                          ? "border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                          : "border-slate-200/70 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60"
                      } ${
                        isAlert
                          ? "border-l-4 border-l-rose-500"
                          : ""
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${notification.iconBg}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1 sm:pr-24">
                        <h3
                          className={`text-sm font-bold ${
                            isAlert
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        <div className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {notification.content}
                        </div>

                        {notification.actions?.length > 0 && (
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {renderActions(notification)}
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-3 sm:absolute sm:right-5 sm:top-5">
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                          {notification.time}
                        </span>

                        {notification.isUnread && (
                          <span
                            className="h-2.5 w-2.5 rounded-full bg-indigo-600"
                            aria-label="Unread notification"
                          />
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
};

export default Notifications;