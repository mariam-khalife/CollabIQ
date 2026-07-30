import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle2,
  Cpu,
  History,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import "../styles/dashboard.css";

import {
  getCurrentUser,
  getUserTeams,
} from "../services/userService";

import {
  getTeamMembers,
  getTeamReadiness,
} from "../services/teamService";

import { getTeamProject } from "../services/projectService";

import {
  getProjectRoadmap,
  getRoadmapProgress,
} from "../services/roadmapService";

import {
  getProjectTasks,
  getUserTasks,
} from "../services/taskService";

import { getMyReputation } from "../services/reputationService";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notificationService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);

  const [project, setProject] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapProgress, setRoadmapProgress] =
    useState(null);

  const [teamMembers, setTeamMembers] = useState([]);
  const [readiness, setReadiness] = useState(null);

  const [projectTasks, setProjectTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);

  const [reputation, setReputation] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const isLeader =
    Boolean(currentUser) &&
    Boolean(activeTeam) &&
    currentUser.id === activeTeam.leader_id;

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return null;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return {
      month: date.toLocaleDateString("en-US", {
        month: "short",
      }),

      day: date.toLocaleDateString("en-US", {
        day: "2-digit",
      }),

      full: date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };
  };

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  };

  const clearTeamData = () => {
    setProject(null);
    setRoadmap(null);
    setRoadmapProgress(null);
    setProjectTasks([]);
  };

  const loadTeamData = async (team) => {
    const [membersData, readinessData] =
      await Promise.all([
        getTeamMembers(team.id),
        getTeamReadiness(team.id),
      ]);

    setTeamMembers(membersData);
    setReadiness(readinessData);

    try {
      const projectData = await getTeamProject(team.id);

      setProject(projectData);

      const projectTasksData = await getProjectTasks(
        projectData.id
      );

      setProjectTasks(projectTasksData);

      try {
        const roadmapData =
          await getProjectRoadmap(projectData.id);

        setRoadmap(roadmapData);

        const progressData =
          await getRoadmapProgress(roadmapData.id);

        setRoadmapProgress(progressData);
      } catch (roadmapError) {
        const message =
          roadmapError.message?.toLowerCase() || "";

        if (message.includes("roadmap not found")) {
          setRoadmap(null);
          setRoadmapProgress(null);
        } else {
          throw roadmapError;
        }
      }
    } catch (projectError) {
      const message =
        projectError.message?.toLowerCase() || "";

      if (message.includes("project not found")) {
        clearTeamData();
      } else {
        throw projectError;
      }
    }
  };

  const findPreferredTeam = async (userTeams) => {
    for (const team of userTeams) {
      try {
        await getTeamProject(team.id);
        return team;
      } catch (error) {
        const message =
          error.message?.toLowerCase() || "";

        if (!message.includes("project not found")) {
          throw error;
        }
      }
    }

    return userTeams[0];
  };

  const loadDashboard = async ({
    refreshing = false,
  } = {}) => {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage("");

      const userData = await getCurrentUser();
      setCurrentUser(userData);

      const [
        userTeams,
        assignedTasks,
        reputationData,
        notificationsData,
      ] = await Promise.all([
        getUserTeams(userData.id),
        getUserTasks(userData.id),
        getMyReputation(),
        getNotifications(),
      ]);

      setTeams(userTeams);
      setUserTasks(assignedTasks);
      setReputation(reputationData);
      setNotifications(notificationsData);

      if (userTeams.length > 0) {
        const preferredTeam =
          await findPreferredTeam(userTeams);

        setActiveTeam(preferredTeam);
        await loadTeamData(preferredTeam);
      } else {
        setActiveTeam(null);
        setTeamMembers([]);
        setReadiness(null);
        clearTeamData();
      }
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to load dashboard information."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleTeamChange = async (event) => {
    const selectedTeam = teams.find(
      (team) => team.id === event.target.value
    );

    if (!selectedTeam) {
      return;
    }

    try {
      setIsRefreshing(true);
      setErrorMessage("");
      setActiveTeam(selectedTeam);

      await loadTeamData(selectedTeam);
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to load the selected team."
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredTeamMembers = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return teamMembers;
    }

    return teamMembers.filter((member) => {
      return (
        member.full_name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        member.role_name
          ?.toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [search, teamMembers]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    return userTasks
      .filter((task) => {
        if (!task.deadline) {
          return false;
        }

        const deadline = new Date(task.deadline);

        return (
          !Number.isNaN(deadline.getTime()) &&
          deadline >= today &&
          task.status !== "done" &&
          task.status !== "completed"
        );
      })
      .sort(
        (firstTask, secondTask) =>
          new Date(firstTask.deadline) -
          new Date(secondTask.deadline)
      )
      .slice(0, 4);
  }, [userTasks]);

  const recentActivities = useMemo(() => {
    const reputationLabels = {
      team_joined: "Joined a project team",
      task_completed: "Completed a task",
      project_completed: "Completed a project",
      positive_feedback: "Received positive feedback",
      deadline_missed: "Missed a deadline",
      left_project_early: "Left a project early",
    };

    const notificationActivities = (
      notifications || []
    ).map((notification) => ({
      id: `notification-${notification.id}`,
      source: "notification",
      type: notification.type,
      title: notification.title,
      message: notification.message,
      date: notification.created_at,
      isRead: notification.is_read,
      points: null,
      relatedId: notification.related_id,
      actionUrl: notification.action_url,
    }));

    const reputationActivities = (
      reputation?.history || []
    ).map((event) => ({
      id: `reputation-${event.id}`,
      source: "reputation",
      type: event.activity_type,
      title:
        reputationLabels[event.activity_type] ||
        event.activity_type
          ?.replaceAll("_", " ")
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
          ),
      message:
        event.points >= 0
          ? `You earned ${event.points} reputation points.`
          : `You lost ${Math.abs(
              event.points
            )} reputation points.`,
      date: event.logged_at,
      isRead: true,
      points: event.points,
      actionUrl: "/reputation",
    }));

    return [
      ...notificationActivities,
      ...reputationActivities,
    ]
      .filter((activity) => activity.date)
      .sort(
        (firstActivity, secondActivity) =>
          new Date(secondActivity.date) -
          new Date(firstActivity.date)
      )
      .slice(0, 5);
  }, [notifications, reputation]);

  const getActivityIcon = (type) => {
    switch (type) {
      case "task_assignment":
        return CheckCircle2;

      case "deadline_reminder":
        return Calendar;

      case "invitation":
      case "team_update":
      case "team_joined":
        return Users;

      case "project_update":
      case "project_completed":
        return Cpu;

      case "positive_feedback":
      case "task_completed":
        return Award;

      default:
        return History;
    }
  };


  const handleActivityClick = async (activity) => {
    try {
      setErrorMessage("");

      if (
        activity.source === "notification" &&
        !activity.isRead
      ) {
        const notificationId = activity.id.replace(
          "notification-",
          ""
        );

        await markNotificationAsRead(notificationId);

        setNotifications((currentNotifications) =>
          currentNotifications.map((notification) =>
            String(notification.id) ===
            String(notificationId)
              ? {
                  ...notification,
                  is_read: true,
                }
              : notification
          )
        );
      }

      if (
        activity.type === "task_assignment" ||
        activity.type === "deadline_reminder"
      ) {
        navigate("/my-projects", {
          state: {
            taskId: activity.relatedId,
          },
        });
        return;
      }

      if (
        activity.type === "invitation" ||
        activity.type === "team_update"
      ) {
        navigate("/team-management");
        return;
      }

      if (activity.type === "project_update") {
        navigate("/my-projects");
        return;
      }

      if (activity.source === "reputation") {
        navigate("/reputation");
        return;
      }

      if (activity.actionUrl) {
        navigate(activity.actionUrl);
      }
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to open this activity."
      );
    }
  };

  const currentPhase = useMemo(() => {
    if (!roadmap?.phases?.length) {
      return "Not available";
    }

    const sortedPhases = [...roadmap.phases].sort(
      (first, second) =>
        first.phase_order - second.phase_order
    );

    const inProgressPhase = sortedPhases.find(
      (phase) => phase.status === "in_progress"
    );

    if (inProgressPhase) {
      return inProgressPhase.phase_name;
    }

    const nextPhase = sortedPhases.find(
      (phase) => phase.status === "todo"
    );

    if (nextPhase) {
      return nextPhase.phase_name;
    }

    return (
      sortedPhases[sortedPhases.length - 1]
        ?.phase_name || "Completed"
    );
  }, [roadmap]);

  if (isLoading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="w-full font-sans text-slate-800 antialiased dark:text-slate-100">
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Academic Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Welcome back,{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {currentUser?.full_name || "Student"}
              </span>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {teams.length > 0 && (
              <select
                value={activeTeam?.id || ""}
                onChange={handleTeamChange}
                disabled={isRefreshing}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900"
              >
                {teams.map((team) => (
                  <option
                    key={team.id}
                    value={team.id}
                  >
                    {team.team_name}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={() =>
                loadDashboard({
                  refreshing: true,
                })
              }
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isRefreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              {isRefreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </section>

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          <article className="flex min-h-56 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:col-span-2 lg:col-span-6">
            {project ? (
              <>
                <div>
                  <div className="flex items-start justify-between">
                    <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                      Active Project
                    </span>

                    <Cpu className="h-5 w-5 text-indigo-500" />
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                    {project.description ||
                      "No project description available."}
                  </p>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs font-bold">
                      <span>Roadmap progress</span>

                      <span>
                        {roadmapProgress?.progress_percentage ??
                          0}
                        %
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{
                          width: `${
                            roadmapProgress?.progress_percentage ??
                            0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
                  <div>
                    <p className="text-slate-400">
                      Phase
                    </p>

                    <p className="mt-1 font-bold">
                      {currentPhase}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Tasks
                    </p>

                    <p className="mt-1 font-bold">
                      {projectTasks.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Status
                    </p>

                    <p className="mt-1 font-bold capitalize">
                      {project.status?.replaceAll(
                        "_",
                        " "
                      )}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <AlertCircle className="h-9 w-9 text-slate-300" />

                <h2 className="mt-3 font-bold">
                  No project available
                </h2>

                <p className="mt-2 text-xs text-slate-500">
                  {isLeader
                    ? "Create or select a project for this team."
                    : "The team leader has not created a project yet."}
                </p>
              </div>
            )}
          </article>

          <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-3">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Current Team
                </h2>

                <Users className="h-4 w-4 text-indigo-500" />
              </div>

              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search members..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="mt-4 max-h-40 space-y-3 overflow-y-auto">
                {filteredTeamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {getInitials(member.full_name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold">
                        {member.full_name}
                      </p>

                      <p className="truncate text-[10px] text-slate-400">
                        {member.role_name}
                      </p>
                    </div>
                  </div>
                ))}

                {filteredTeamMembers.length === 0 && (
                  <p className="text-xs italic text-slate-400">
                    No team members found.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/team-management")
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Manage Team
            </button>
          </article>

          <article className="flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-3">
            <h2 className="self-start text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Team Readiness
            </h2>

            <div className="relative my-3 flex h-28 w-28 items-center justify-center">
              <svg
                className="h-full w-full -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />

                <path
                  className="text-indigo-600"
                  strokeDasharray={`${
                    readiness?.readiness_score ?? 0
                  }, 100`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute">
                <p className="text-2xl font-black">
                  {readiness?.readiness_score ?? 0}%
                </p>

                <p className="text-[9px] text-slate-400">
                  Ready
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              {readiness?.member_count ?? 0} total{" "}
              {(readiness?.member_count ?? 0) === 1
                ? "member"
                : "members"}
            </p>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-4">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Upcoming Deadlines
              </h2>

              <Calendar className="h-4 w-4 text-slate-400" />
            </div>

            <div className="space-y-4">
              {upcomingDeadlines.map((task) => {
                const taskDate = formatDate(
                  task.deadline
                );

                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3"
                  >
                    <div className="flex min-w-12 shrink-0 flex-col items-center rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
                      <span className="text-[9px] font-bold uppercase">
                        {taskDate?.month}
                      </span>

                      <span className="text-base font-bold">
                        {taskDate?.day}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold">
                        {task.title}
                      </p>

                      <p className="mt-1 truncate text-[10px] capitalize text-slate-400">
                        {task.priority || "medium"} priority
                        {" • "}
                        {task.status?.replaceAll(
                          "_",
                          " "
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}

              {upcomingDeadlines.length === 0 && (
                <p className="py-4 text-center text-xs italic text-slate-400">
                  No upcoming deadlines.
                </p>
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Recent Activity
              </h2>

              <History className="h-4 w-4 text-slate-400" />
            </div>

            <div className="max-h-48 space-y-4 overflow-y-auto">
              {recentActivities.map((activity) => {
                const ActivityIcon = getActivityIcon(
                  activity.type
                );

                return (
                  <button
                    type="button"
                    key={activity.id}
                    onClick={() => handleActivityClick(activity)}

                    className={`flex w-full items-start gap-3 rounded-xl p-2 text-left transition ${
                      activity.actionUrl
                        ? "hover:bg-slate-50 dark:hover:bg-slate-800"
                        : ""
                    }`}
                  >
                    <div
                      className={`mt-1 rounded-lg p-2 ${
                        !activity.isRead
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <ActivityIcon className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                          {activity.title}
                        </p>

                        {!activity.isRead && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                        )}
                      </div>

                      <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                        {activity.message}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {formatDate(activity.date)?.full ||
                          "Recently"}
                      </p>
                    </div>

                    {activity.points !== null && (
                      <span
                        className={`shrink-0 text-xs font-bold ${
                          activity.points >= 0
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {activity.points >= 0 ? "+" : ""}
                        {activity.points}
                      </span>
                    )}
                  </button>
                );
              })}

              {recentActivities.length === 0 && (
                <p className="py-4 text-center text-xs italic text-slate-400">
                  No recent activity.
                </p>
              )}
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:col-span-2 lg:col-span-3">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Reputation Score
              </h2>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black">
                  {reputation?.score ?? 0}
                </span>

                <span className="text-xs text-slate-400">
                  points
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="rounded-xl bg-indigo-600 p-2 text-white">
                  <Award className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-bold">
                    {reputation?.level ||
                      "New Member"}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {reputation?.total_events ?? 0}{" "}
                    {(reputation?.total_events ?? 0) === 1
                      ? "reputation event"
                      : "reputation events"}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/reputation")}
              className="mt-4 border-t border-slate-100 pt-4 text-left text-[10px] font-bold text-indigo-600 dark:border-slate-700 dark:text-indigo-400"
            >
              View reputation details
            </button>
          </article>
        </section>
      </div>
    </div>
  );
}