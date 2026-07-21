import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Calendar,
  CheckCircle2,
  Cpu,
  FileText,
  MessageSquare,
  Plus,
  Search,
} from "lucide-react";

import "../styles/dashboard.css";

const API_URL = "http://127.0.0.1:8000";

const sampleTeamMembers = [
  {
    id: 1,
    name: "Team Member",
    role: "Data Scientist",
  },
  {
    id: 2,
    name: "Team Member",
    role: "UI/UX Designer",
  },
  {
    id: 3,
    name: "Team Member",
    role: "AI Engineer",
  },
];

const sampleDeadlines = [
  {
    id: 1,
    month: "Jul",
    day: "24",
    title: "Dataset Submission",
    location: "Project Workspace",
    status: "Upcoming",
  },
  {
    id: 2,
    month: "Jul",
    day: "28",
    title: "UI Review",
    location: "Online Meeting",
    status: "Upcoming",
  },
  {
    id: 3,
    month: "Jul",
    day: "30",
    title: "Final Project Review",
    location: "Submission Portal",
    status: "Upcoming",
  },
];

const sampleActivities = [
  {
    id: 1,
    user: "Team member",
    action: "updated",
    target: "a project task",
    time: "Recently",
    type: "file",
  },
  {
    id: 2,
    user: "System",
    action: "generated",
    target: "new teammate recommendations",
    time: "Recently",
    type: "system",
  },
  {
    id: 3,
    user: "Team member",
    action: "updated",
    target: "the project roadmap",
    time: "Recently",
    type: "chat",
  },
];

function getStoredToken() {
  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({
    full_name: "Student",
  });

  const [search, setSearch] = useState("");
  const [progress] = useState(78);
  const [readiness] = useState(92);
  const [reputation] = useState(842);

  const [teamMembers] = useState(sampleTeamMembers);
  const [deadlines, setDeadlines] = useState(sampleDeadlines);
  const [activities, setActivities] = useState(sampleActivities);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = getStoredToken();

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCurrentUser(response.data);
      } catch (error) {
        console.error("Failed to load current user:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          sessionStorage.removeItem("access_token");
          navigate("/login");
        }
      }
    };

    loadCurrentUser();
  }, [navigate]);

  const filteredTeamMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return teamMembers;
    }

    return teamMembers.filter((member) => {
      return (
        member.name.toLowerCase().includes(normalizedSearch) ||
        member.role.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [search, teamMembers]);

  const handleCompleteDeadline = (deadlineId, deadlineTitle) => {
    setDeadlines((previousDeadlines) =>
      previousDeadlines.filter((deadline) => deadline.id !== deadlineId)
    );

    setActivities((previousActivities) => [
      {
        id: Date.now(),
        user: currentUser.full_name || "Current user",
        action: "completed",
        target: deadlineTitle,
        time: "Just now",
        type: "system",
      },
      ...previousActivities,
    ]);
  };

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="w-full font-sans text-slate-800 antialiased">
      <div className="space-y-6">
        {/* Header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Academic Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Welcome back,{" "}
              <span className="font-semibold text-slate-700">
                {currentUser.full_name || "Student"}
              </span>
              .
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-52">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />

              <input
                type="search"
                placeholder="Search team..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate("/my-projects")}
                className="flex-1 whitespace-nowrap rounded-xl border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 sm:flex-none"
              >
                View Project
              </button>

              <button
                type="button"
                onClick={() => navigate("/team-management")}
                className="flex-1 whitespace-nowrap rounded-xl bg-indigo-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-800 sm:flex-none"
              >
                Build Team
              </button>
            </div>
          </div>
        </section>

        {/* First row */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          {/* Project */}
          <article className="flex min-h-56 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2 lg:col-span-6">
            <div>
              <div className="flex items-start justify-between">
                <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Active Project
                </span>

                <Cpu className="h-5 w-5 text-indigo-500" />
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Current Academic Project
              </h2>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs font-bold">
                  <span>Overall progress</span>
                  <span>{progress}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-xs">
              <div>
                <p className="text-slate-400">Phase</p>
                <p className="mt-1 font-bold">Development</p>
              </div>

              <div>
                <p className="text-slate-400">Priority</p>
                <p className="mt-1 font-bold text-rose-600">High</p>
              </div>

              <div>
                <p className="text-slate-400">Status</p>
                <p className="mt-1 font-bold">In Progress</p>
              </div>
            </div>
          </article>

          {/* Team */}
          <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Current Team
              </h2>

              <div className="mt-4 max-h-40 space-y-3 overflow-y-auto">
                {filteredTeamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      {getInitials(member.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800">
                        {member.name}
                      </p>

                      <p className="truncate text-[10px] text-slate-400">
                        {member.role}
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
              onClick={() => navigate("/ai-matching")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              Find Teammates
            </button>
          </article>

          {/* Readiness */}
          <article className="flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm lg:col-span-3">
            <h2 className="self-start text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Team Readiness
            </h2>

            <div className="relative my-3 flex h-28 w-28 items-center justify-center">
              <svg
                className="h-full w-full -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-slate-100"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />

                <path
                  className="text-indigo-600"
                  strokeDasharray={`${readiness}, 100`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute">
                <p className="text-2xl font-black">{readiness}%</p>
                <p className="text-[9px] text-slate-400">Ready</p>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Team readiness is calculated from skills and availability.
            </p>
          </article>
        </section>

        {/* Second row */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          {/* Deadlines */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Upcoming Deadlines
              </h2>

              <Calendar className="h-4 w-4 text-slate-400" />
            </div>

            <div className="space-y-4">
              {deadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="group flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex min-w-12 shrink-0 flex-col items-center rounded-xl bg-indigo-50 p-2 text-indigo-600">
                      <span className="text-[9px] font-bold uppercase">
                        {deadline.month}
                      </span>

                      <span className="text-base font-bold">
                        {deadline.day}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold">
                        {deadline.title}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-slate-400">
                        {deadline.status} • {deadline.location}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCompleteDeadline(
                        deadline.id,
                        deadline.title
                      )
                    }
                    className="rounded-lg p-1 text-slate-400 transition hover:text-emerald-600"
                    aria-label={`Complete ${deadline.title}`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {deadlines.length === 0 && (
                <p className="py-4 text-center text-xs italic text-slate-400">
                  No upcoming deadlines.
                </p>
              )}
            </div>
          </article>

          {/* Activity */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Recent Activity
              </h2>

              <button
                type="button"
                onClick={() => setActivities([])}
                className="text-[11px] font-bold text-slate-400 transition hover:text-rose-600"
              >
                Clear
              </button>
            </div>

            <div className="max-h-48 space-y-4 overflow-y-auto">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1 rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    {activity.type === "file" && (
                      <FileText className="h-3 w-3" />
                    )}

                    {activity.type === "system" && (
                      <CheckCircle2 className="h-3 w-3" />
                    )}

                    {activity.type === "chat" && (
                      <MessageSquare className="h-3 w-3" />
                    )}
                  </div>

                  <div className="min-w-0 text-xs">
                    <p className="break-words text-slate-600">
                      <span className="font-bold text-slate-800">
                        {activity.user}
                      </span>{" "}
                      {activity.action}{" "}
                      <span className="font-semibold text-indigo-600">
                        {activity.target}
                      </span>
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}

              {activities.length === 0 && (
                <p className="py-4 text-center text-xs italic text-slate-400">
                  No recent activity.
                </p>
              )}
            </div>
          </article>

          {/* Reputation */}
          <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2 lg:col-span-3">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Reputation Score
              </h2>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black">
                  {reputation}
                </span>

                <span className="text-xs text-slate-400">
                  / 1000
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="rounded-xl bg-indigo-600 p-2 text-white">
                  <Award className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-bold">
                    Active Contributor
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Based on completed teamwork
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-400">
              <span>Performance</span>
              <span className="font-bold text-emerald-600">
                High
              </span>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
