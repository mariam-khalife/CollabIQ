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
      iconBg: "bg-emerald-600 text-white",
      content: (
        <>
          Based on your recent research in{" "}
          <strong className="font-bold text-slate-900">Neural Networks</strong>,
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
      iconBg: "bg-indigo-600 text-white",
      content: (
        <>
          <strong className="font-bold text-slate-900">Sarah Jenkins</strong>{" "}
          invited you to join their project team as a{" "}
          <strong className="font-bold text-indigo-600">Lead Developer</strong>.
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
      iconBg: "bg-indigo-50 text-indigo-600",
      content: (
        <>
          You have been assigned the task{" "}
          <em className="font-semibold text-slate-800">
            "Draft Project Abstract"
          </em>{" "}
          by{" "}
          <strong className="font-bold text-slate-900">
            Prof. Marcus Miller
          </strong>
          .
        </>
      ),
      actions: [
        { label: "Open Task Board →", variant: "link", action: "open_task" },
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
      iconBg: "bg-rose-100 text-rose-600",
      content: (
        <>
          The final submission for{" "}
          <strong className="font-bold text-slate-900">
            Capstone Project Phase 1
          </strong>{" "}
          is due in <strong className="font-bold text-rose-600">24 hours</strong>
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
      iconBg: "bg-slate-100 text-slate-600",
      content: (
        <>
          Your contribution to the{" "}
          <strong className="font-bold text-slate-900">
            Open Source ML Kit
          </strong>{" "}
          was highly rated. You earned{" "}
          <strong className="font-bold text-emerald-600">
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

  const [activeTab, setActiveTab] = useState("All"); // 'All' | 'Unread' | 'Invitations'
  const [searchQuery, setSearchQuery] = useState("");

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
        item.time.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "Unread") return item.isUnread;
      if (activeTab === "Invitations") return item.category === "invitation";
      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  // Handlers for Backend Connection
  const handleMarkAllRead = () => {
    // API.post('/notifications/mark-all-read')
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleAction = (id, actionType) => {
    if (actionType === "dismiss") {
      // API.delete(`/notifications/${id}`)
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      return;
    }

    if (actionType === "accept" || actionType === "decline") {
      // API.post(`/notifications/${id}/respond`, { action: actionType })
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      return;
    }

    // Default action handler (e.g. Navigation)
    console.log(`Action executed: ${actionType} for item ${id}`);
  };

  // Group items by timeframe ("TODAY", "YESTERDAY")
  const groupedNotifications = useMemo(() => {
    return filteredNotifications.reduce((acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    }, {});
  }, [filteredNotifications]);

  return (
    <div className="flex-1 bg-white min-h-screen">
      {/* Top Header Navbar */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold text-indigo-950 tracking-tight">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-xs">
              {unreadCount} New
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100/70 border border-transparent rounded-full text-xs focus:outline-none focus:bg-white focus:border-indigo-600 transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <HelpCircle className="w-5 h-5" />
          </button>

          <button className="relative text-slate-400 hover:text-slate-600 cursor-pointer">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          <img
            src="https://i.pravatar.cc/150?img=68"
            alt="Alex Johnson"
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-5xl mx-auto p-8 space-y-6">
        {/* Filter Navigation & Global Actions */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            {["All", "Unread", "Invitations"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* List Sections */}
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium">
              No notifications found
            </p>
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([group, items]) => (
            <section key={group} className="space-y-3">
              <h2 className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase pl-1">
                {group}
              </h2>

              <div className="space-y-3">
                {items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      className={`relative flex items-start gap-4 p-5 rounded-2xl border transition-all ${
                        item.isUnread
                          ? "bg-slate-50/50 border-slate-200 shadow-2xs"
                          : "bg-white border-slate-100"
                      }`}
                    >
                      {/* Left Category Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 min-w-0 pr-12">
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className={`text-xs font-extrabold leading-tight ${
                              item.type === "alert"
                                ? "text-rose-600"
                                : "text-slate-800"
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          {item.content}
                        </p>

                        {/* Interactive Buttons */}
                        {item.actions && item.actions.length > 0 && (
                          <div className="flex items-center gap-2.5 mt-3.5">
                            {item.actions.map((btn, idx) => {
                              if (btn.variant === "primary") {
                                return (
                                  <button
                                    key={idx}
                                    onClick={() =>
                                      handleAction(item.id, btn.action)
                                    }
                                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                  >
                                    {btn.label}
                                  </button>
                                );
                              }
                              if (btn.variant === "secondary") {
                                return (
                                  <button
                                    key={idx}
                                    onClick={() =>
                                      handleAction(item.id, btn.action)
                                    }
                                    className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                  >
                                    {btn.label}
                                  </button>
                                );
                              }
                              if (btn.variant === "soft-secondary") {
                                return (
                                  <button
                                    key={idx}
                                    onClick={() =>
                                      handleAction(item.id, btn.action)
                                    }
                                    className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                  >
                                    {btn.label}
                                  </button>
                                );
                              }
                              if (btn.variant === "text") {
                                return (
                                  <button
                                    key={idx}
                                    onClick={() =>
                                      handleAction(item.id, btn.action)
                                    }
                                    className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                                  >
                                    {btn.label}
                                  </button>
                                );
                              }
                              if (btn.variant === "link") {
                                return (
                                  <button
                                    key={idx}
                                    onClick={() =>
                                      handleAction(item.id, btn.action)
                                    }
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                                  >
                                    {btn.label}
                                  </button>
                                );
                              }
                              return null;
                            })}
                          </div>
                        )}
                      </div>

                      {/* Right Meta (Time & Unread Dot) */}
                      <div className="absolute top-5 right-5 flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-400">
                          {item.time}
                        </span>
                        {item.isUnread && (
                          <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                        )}
                      </div>
                    </div>
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