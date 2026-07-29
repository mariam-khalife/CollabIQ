import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Clock3,
  FolderKanban,
  Loader2,
  RefreshCw,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import {
  acceptInvitation,
  declineInvitation,
  getMyInvitations,
} from "../services/invitationService";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notificationService";

const TABS = ["All", "Unread", "Invitations"];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] =
    useState(false);

  const [processingId, setProcessingId] =
    useState(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] =
    useState("");

  const clearMessages = () => {
    setMessage("");
    setErrorMessage("");
  };

  const loadPageData = async () => {
    try {
      setIsLoading(true);
      clearMessages();

      const [notificationData, invitationData] =
        await Promise.all([
          getNotifications(),
          getMyInvitations(),
        ]);

      setNotifications(notificationData);
      setInvitations(invitationData);
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to load notifications."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.is_read
      ).length,
    [notifications]
  );

  const invitationById = useMemo(() => {
    return new Map(
      invitations.map((invitation) => [
        String(invitation.id),
        invitation,
      ])
    );
  }, [invitations]);

  const visibleNotifications = useMemo(() => {
    const normalizedSearch = searchQuery
      .trim()
      .toLowerCase();

    return notifications.filter((notification) => {
      if (
        activeTab === "Unread" &&
        notification.is_read
      ) {
        return false;
      }

      if (
        activeTab === "Invitations" &&
        notification.type !== "invitation"
      ) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const relatedInvitation =
        notification.related_id
          ? invitationById.get(
              String(notification.related_id)
            )
          : null;

      const searchableContent = [
        notification.title,
        notification.message,
        notification.type,
        relatedInvitation?.team_name,
        relatedInvitation?.inviter_name,
        relatedInvitation?.proposed_role_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(
        normalizedSearch
      );
    });
  }, [
    activeTab,
    invitationById,
    notifications,
    searchQuery,
  ]);

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Unknown date";
    }

    const date = new Date(dateValue);
    const now = new Date();

    const differenceInMilliseconds =
      now.getTime() - date.getTime();

    const differenceInMinutes = Math.floor(
      differenceInMilliseconds / 60000
    );

    if (differenceInMinutes < 1) {
      return "Just now";
    }

    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} min ago`;
    }

    const differenceInHours = Math.floor(
      differenceInMinutes / 60
    );

    if (differenceInHours < 24) {
      return `${differenceInHours} hr ago`;
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "invitation":
        return UserPlus;

      case "task_assignment":
      case "deadline_reminder":
        return Clock3;

      case "team_update":
        return Users;

      case "project_update":
        return FolderKanban;

      default:
        return Bell;
    }
  };

  const getNotificationColors = (type) => {
    switch (type) {
      case "invitation":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300";

      case "task_assignment":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300";

      case "deadline_reminder":
        return "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300";

      case "team_update":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300";

      case "project_update":
        return "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300";

      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const markReadLocally = (notificationId) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              is_read: true,
            }
          : notification
      )
    );
  };

  const handleNotificationClick = async (
    notification
  ) => {
    if (!notification.is_read) {
      try {
        const updatedNotification =
          await markNotificationAsRead(
            notification.id
          );

        setNotifications(
          (currentNotifications) =>
            currentNotifications.map((item) =>
              item.id === notification.id
                ? updatedNotification
                : item
            )
        );
      } catch (error) {
        setErrorMessage(
          error.message ||
            "Unable to mark notification as read."
        );
        return;
      }
    }

    if (
      notification.action_url &&
      !notification.action_url.startsWith("/tasks/")
    ) {
      window.location.href =
        notification.action_url;
    }
  };

  const handleAccept = async (
    invitation,
    notification
  ) => {
    try {
      setProcessingId(invitation.id);
      clearMessages();

      await acceptInvitation(invitation.id);

      setInvitations((currentInvitations) =>
        currentInvitations.filter(
          (item) => item.id !== invitation.id
        )
      );

      if (notification) {
        if (!notification.is_read) {
          try {
            await markNotificationAsRead(
              notification.id
            );
          } catch {
            // Invitation was accepted successfully.
          }
        }

        setNotifications(
          (currentNotifications) =>
            currentNotifications.filter(
              (item) =>
                item.id !== notification.id
            )
        );
      }

      setMessage(
        "Invitation accepted successfully. You are now a team member."
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to accept the invitation."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (
    invitation,
    notification
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to decline this invitation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(invitation.id);
      clearMessages();

      await declineInvitation(invitation.id);

      setInvitations((currentInvitations) =>
        currentInvitations.filter(
          (item) => item.id !== invitation.id
        )
      );

      if (notification) {
        if (!notification.is_read) {
          try {
            await markNotificationAsRead(
              notification.id
            );
          } catch {
            // Invitation was declined successfully.
          }
        }

        setNotifications(
          (currentNotifications) =>
            currentNotifications.filter(
              (item) =>
                item.id !== notification.id
            )
        );
      }

      setMessage("Invitation declined.");
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to decline the invitation."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setIsMarkingAll(true);
      clearMessages();

      await markAllNotificationsAsRead();

      setNotifications(
        (currentNotifications) =>
          currentNotifications.map(
            (notification) => ({
              ...notification,
              is_read: true,
            })
          )
      );

      setMessage(
        "All notifications marked as read."
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to mark notifications as read."
      );
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <div className="min-h-full text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review invitations, task assignments,
              deadlines, and team updates.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>
        </div>

        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={isMarkingAll}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {isMarkingAll ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCheck className="h-4 w-4" />
                )}

                Mark all read
              </button>
            )}

            <button
              type="button"
              onClick={loadPageData}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : visibleNotifications.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 py-16 text-center dark:border-slate-700">
            <div className="mb-4 inline-flex rounded-full bg-slate-100 p-4 dark:bg-slate-800">
              <Bell className="h-8 w-8 text-slate-400" />
            </div>

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {activeTab === "Unread"
                ? "No unread notifications."
                : activeTab === "Invitations"
                  ? "No invitation notifications."
                  : "No notifications found."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleNotifications.map(
              (notification) => {
                const NotificationIcon =
                  getNotificationIcon(
                    notification.type
                  );

                const relatedInvitation =
                  notification.related_id
                    ? invitationById.get(
                        String(
                          notification.related_id
                        )
                      )
                    : null;

                return (
                  <article
                    key={notification.id}
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                    className={`flex cursor-pointer flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:bg-slate-900 sm:flex-row sm:items-center ${
                      notification.is_read
                        ? "border-slate-200 dark:border-slate-800"
                        : "border-indigo-200 bg-indigo-50/30 dark:border-indigo-900 dark:bg-indigo-950/10"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getNotificationColors(
                        notification.type
                      )}`}
                    >
                      <NotificationIcon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {notification.title}
                        </h3>

                        {!notification.is_read && (
                          <span className="h-2 w-2 rounded-full bg-indigo-600" />
                        )}
                      </div>

                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {relatedInvitation ? (
                          <>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {
                                relatedInvitation.inviter_name
                              }
                            </span>{" "}
                            invited you to join{" "}
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {
                                relatedInvitation.team_name
                              }
                            </span>{" "}
                            as{" "}
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {
                                relatedInvitation.proposed_role_name
                              }
                            </span>
                            .
                          </>
                        ) : (
                          notification.message
                        )}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(
                          notification.created_at
                        )}
                      </p>
                    </div>

                    {relatedInvitation &&
                    relatedInvitation.status ===
                      "pending" ? (
                      <div
                        className="flex flex-wrap gap-2"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleAccept(
                              relatedInvitation,
                              notification
                            )
                          }
                          disabled={
                            processingId ===
                            relatedInvitation.id
                          }
                          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {processingId ===
                          relatedInvitation.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}

                          Accept
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDecline(
                              relatedInvitation,
                              notification
                            )
                          }
                          disabled={
                            processingId ===
                            relatedInvitation.id
                          }
                          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          <X className="h-4 w-4" />
                          Decline
                        </button>
                      </div>
                    ) : !notification.is_read ? (
                      <button
                        type="button"
                        onClick={async (event) => {
                          event.stopPropagation();

                          try {
                            await markNotificationAsRead(
                              notification.id
                            );

                            markReadLocally(
                              notification.id
                            );
                          } catch (error) {
                            setErrorMessage(
                              error.message ||
                                "Unable to mark notification as read."
                            );
                          }
                        }}
                        className="flex items-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Check className="h-4 w-4" />
                        Mark read
                      </button>
                    ) : null}
                  </article>
                );
              }
            )}
          </div>
        )}
      </main>
    </div>
  );
}