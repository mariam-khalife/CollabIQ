import React, { useState, useMemo } from "react";
import {
  Search,
  HelpCircle,
  Bell,
  CheckCheck,
  Brain,
  UserPlus,
  ClipboardList,
  AlertCircle,
  Award,
  X,
  Filter,
  Clock,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

const Notifications = () => {
  // Master notification state ready for backend integration
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
      iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      content: (
        <>
          Based on your recent research in{" "}
          <strong className="font-bold text-slate-900 dark:text-white">Neural Networks</strong>,
          we found 3 potential teammates in your department with matching
          skillsets.
        </>
      ),
      actions: [
        { label: "View Matches", variant: "primary", action: "view_matches" },
        { label: "Dismiss", variant: "text", action: "dismiss" },
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
      iconBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      content: (
        <>
          <strong className="font-bold text-slate-900 dark:text-white">Sarah Jenkins</strong>{" "}
          invited you to join their project team as a{" "}
          <strong className="font-bold text-indigo-600 dark:text-indigo-400">Lead Developer</strong>.
        </>
      ),
      actions: [
        { label: "Accept", variant: "primary", action: "accept" },
        { label: "Decline", variant: "secondary", action: "decline" },
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
      iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
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
        { label: "Open Task Board", variant: "link", action: "open_task" },
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
      iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
      content: (
        <>
          The final submission for{" "}
          <strong className="font-bold text-slate-900 dark:text-white">
            Capstone Project Phase 1
          </strong>{" "}
          is due in <strong className="font-bold text-rose-600 dark:text-rose-400">24 hours</strong>
          .
        </>
      ),
      actions: [
        { label: "Submit Now", variant: "soft-secondary", action: "submit" },
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
      iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
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
        { label: "View Badge Gallery", variant: "link", action: "view_badges" },
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Unread badge count
  const unreadCount = useMemo(
    () => notifications.filter((n) => n.isUnread).length,
    [notifications]
  );

  // Filter logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content?.props?.children?.toString?.().toLowerCase().includes(searchQuery.toLowerCase()) ||
        false;

      if (!matchesSearch) return false;

      if (activeTab === "Unread") return item.isUnread;
      if (activeTab === "Invitations") return item.category === "invitation";
      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  // Handlers for Backend Connection
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleAction = (id, actionType) => {
    if (actionType === "dismiss") {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      return;
    }

    if (actionType === "accept" || actionType === "decline") {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      return;
    }

    console.log(`Action executed: ${actionType} for item ${id}`);
  };

  // Group items by timeframe
  const groupedNotifications = useMemo(() => {
    return filteredNotifications.reduce((acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    }, {});
  }, [filteredNotifications]);

  const getGroupLabel = (group) => {
    switch (group) {
      case "TODAY":
        return "Today";
      case "YESTERDAY":
        return "Yesterday";
      default:
        return group;
    }
  };

  const renderActions = (item) => {
    return item.actions?.map((btn, idx) => {
      const baseClasses = "px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer";
      
      switch (btn.variant) {
        case "primary":
          return (
            <button
              key={idx}
              onClick={() => handleAction(item.id, btn.action)}
              className={`${baseClasses} bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-sm hover:shadow`}
            >
              {btn.label}
            </button>
          );
        case "secondary":
          return (
            <button
              key={idx}
              onClick={() => handleAction(item.id, btn.action)}
              className={`${baseClasses} bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300`}
            >
              {btn.label}
            </button>
          );
        case "soft-secondary":
          return (
            <button
              key={idx}
              onClick={() => handleAction(item.id, btn.action)}
              className={`${baseClasses} bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300`}
            >
              {btn.label}
            </button>
          );
        case "text":
          return (
            <button
              key={idx}
              onClick={() => handleAction(item.id, btn.action)}
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              {btn.label}
            </button>
          );
        case "link":
          return (
            <button
              key={idx}
              onClick={() => handleAction(item.id, btn.action)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors cursor-pointer flex items-center gap-1 group"
            >
              {btn.label}
              <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="flex-1 bg-slate-50/50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header Navbar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-sm animate-pulse-soft">
              {unreadCount} New
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100/70 dark:bg-slate-800/70 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            <Filter className="w-5 h-5" />
          </button>

          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </button>

          <button className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
            <img
              src="https://i.pravatar.cc/150?img=68"
              alt="Alex Johnson"
              className="w-8 h-8 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
            />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Alex J.
            </span>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Filter Navigation & Global Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {["All", "Unread", "Invitations"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tab}
                {tab === "Unread" && unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 text-white rounded-full text-[9px]">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notification Count */}
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>
            {filteredNotifications.length} notification
            {filteredNotifications.length !== 1 ? "s" : ""}
          </span>
          {searchQuery && (
            <span>
              Filtered by: "<span className="font-medium">{searchQuery}</span>"
            </span>
          )}
        </div>

        {/* List Sections */}
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
            <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
              <Bell className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {searchQuery ? "No notifications match your search" : "No notifications found"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([group, items]) => (
            <section key={group} className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                  {getGroupLabel(group)}
                </h2>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  {items.length} items
                </span>
              </div>

              <div className="space-y-3">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isAlert = item.type === "alert";

                  return (
                    <div
                      key={item.id}
                      className={`relative flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all hover:shadow-md ${
                        item.isUnread
                          ? "bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 shadow-sm"
                          : "bg-white/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/50"
                      } ${isAlert ? "border-l-4 border-l-rose-500" : ""}`}
                    >
                      {/* Left Category Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 min-w-0 pr-0 sm:pr-12">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3
                            className={`text-sm font-extrabold leading-tight ${
                              isAlert
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>

                        <div className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                          {item.content}
                        </div>

                        {/* Interactive Buttons */}
                        {item.actions && item.actions.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 mt-3.5">
                            {renderActions(item)}
                          </div>
                        )}
                      </div>

                      {/* Right Meta (Time & Unread Dot) */}
                      <div className="flex items-center gap-3 shrink-0 sm:absolute sm:top-5 sm:right-5">
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                          {item.time}
                        </span>
                        {item.isUnread && (
                          <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse-soft" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}

        {/* Footer */}
        <div className="text-center pt-6">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {notifications.length} total notifications
          </p>
        </div>
      </main>
    </div>
  );
};

export default Notifications;