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
  { id: 1, name: "Sarah Chen", role: "Data Scientist" },
  { id: 2, name: "Alex Rivera", role: "UI/UX Designer" },
  { id: 3, name: "Michael Chang", role: "AI Engineer" },
];

const sampleDeadlines = [
  { id: 1, month: "Jul", day: "24", title: "Dataset Submission", location: "Project Workspace", status: "Upcoming" },
  { id: 2, month: "Jul", day: "28", title: "UI Review", location: "Online Meeting", status: "Upcoming" },
  { id: 3, month: "Jul", day: "30", title: "Final Project Review", location: "Submission Portal", status: "Upcoming" },
];

const sampleActivities = [
  { id: 1, user: "Team member", action: "updated", target: "a project task", time: "Recently", type: "file" },
  { id: 2, user: "System", action: "generated", target: "new teammate recommendations", time: "Recently", type: "system" },
  { id: 3, user: "Team member", action: "updated", target: "the project roadmap", time: "Recently", type: "chat" },
];

function getStoredToken() {
  return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({ full_name: "Student" });
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState(78);
  const [readiness, setReadiness] = useState(92);
  const [reputation, setReputation] = useState(842);

  const [teamMembers] = useState(sampleTeamMembers);
  const [deadlines, setDeadlines] = useState(sampleDeadlines);
  const [activities, setActivities] = useState(sampleActivities);

  useEffect(() => {
    setCurrentUser({
      full_name: "Demo User",
    });
  }, []);

  const filteredTeamMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return teamMembers;

    return teamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(normalizedSearch) ||
        member.role.toLowerCase().includes(normalizedSearch)
    );
  }, [search, teamMembers]);

  const handleCompleteDeadline = (deadlineId, deadlineTitle) => {
    const remainingDeadlines = deadlines.filter((d) => d.id !== deadlineId);
    setDeadlines(remainingDeadlines);

    setActivities((prev) => [
      {
        id: Date.now(),
        user: currentUser.full_name || "Current user",
        action: "completed",
        target: deadlineTitle,
        time: "Just now",
        type: "system",
      },
      ...prev,
    ]);

    setReputation((prev) => Math.min(prev + 15, 1000));

    if (remainingDeadlines.length === 2) setProgress(85);
    else if (remainingDeadlines.length === 1) setProgress(93);
    else if (remainingDeadlines.length === 0) setProgress(100);
  };

  const handleInviteCollaborator = () => {
    navigate("/ai-matching");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors">
      <main className="w-full min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          
          {/* HEADER SECTION - IMPROVED MOBILE LAYOUT */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight break-words">
                Academic Dashboard
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5 break-words">
                Welcome back,{" "}
                <span className="font-bold text-slate-700">
                  {currentUser.full_name || "Student"}
                </span>
                . Your team is currently{" "}
                <span className="text-emerald-600 font-bold italic">Top Ranked</span>{" "}
                this semester.
              </p>
            </div>

            {/* Actions & Search Controls - BETTER MOBILE STACKING */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto lg:flex-shrink-0">
              <div className="relative w-full sm:w-48 lg:w-56">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search team..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm text-xs sm:text-sm transition-all"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => alert("Opening Project Workspace...")}
                  className="flex-1 sm:flex-none text-center border border-indigo-200 text-indigo-600 text-xs font-semibold px-3 sm:px-4 py-2.5 rounded-xl bg-white hover:bg-indigo-50/50 transition-colors whitespace-nowrap"
                >
                  View Project
                </button>
                <button
                  onClick={handleInviteCollaborator}
                  className="flex-1 sm:flex-none text-center bg-[#312E81] text-white text-xs font-semibold px-4 sm:px-5 py-2.5 rounded-xl hover:bg-indigo-900 transition-colors whitespace-nowrap shadow-sm hover:shadow-md"
                >
                  Build Team
                </button>
              </div>
            </div>
          </div>

          {/* ROW 1: ACTIVE RESEARCH & TEAM STATS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Active Research Card - FIXED OVERFLOW */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    Active Research
                  </span>
                  <div className="text-indigo-500 flex-shrink-0">
                    <Cpu size={18} className="stroke-[1.5]" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-4 leading-snug break-words">
                  AI-Driven Neural Pattern Recognition
                </h3>

                <div className="mt-5">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Overall Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100 text-[11px] sm:text-xs">
                <div className="min-w-0">
                  <p className="text-slate-400 font-medium">Milestone</p>
                  <p className="font-bold text-slate-800 mt-0.5 truncate">
                    {progress >= 100 ? "Finished 🎉" : "Phase 3"}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-slate-400 font-medium">Priority</p>
                  <p className="font-bold text-rose-600 mt-0.5">High</p>
                </div>
                <div className="min-w-0">
                  <p className="text-slate-400 font-medium">Lead</p>
                  <p className="font-bold text-slate-800 mt-0.5 truncate">
                    Dr. Sarah C.
                  </p>
                </div>
              </div>
            </div>

            {/* Current Team Card - FIXED SCROLLING */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-5 sm:p-6 shadow-sm lg:col-span-3">
              <div>
                <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Current Team
                </h4>

                <div className="mt-4 max-h-40 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {filteredTeamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {getInitials(member.name)}
                      </div>
                      <div className="min-w-0 flex-1">
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
                    <p className="text-xs italic text-slate-400 text-center py-2">
                      No team members found.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleInviteCollaborator}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:border-slate-400"
              >
                <Plus className="h-4 w-4" />
                Find Teammates
              </button>
            </div>

            {/* Readiness Card - FIXED CIRCLE POSITIONING */}
            <div className="flex flex-col items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-5 sm:p-6 text-center shadow-sm lg:col-span-3">
              <h4 className="self-start text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Team Readiness
              </h4>

              <div
                className="relative my-3 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setReadiness((prev) => (prev >= 100 ? 70 : prev + 2))}
              >
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-600 transition-all duration-700 ease-out"
                    strokeDasharray={`${readiness}, 100`}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <p className="text-xl sm:text-2xl font-black text-slate-800 leading-none">
                    {readiness}%
                  </p>
                  <p className="text-[9px] font-medium text-slate-400 mt-0.5">
                    {readiness > 90 ? "Optimal" : "Stable"}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {readiness > 90 ? (
                  <span>
                    Ready for the{" "}
                    <span className="text-indigo-600 font-bold">Final Peer Review.</span>
                  </span>
                ) : (
                  <span>Optimizing roadmap indicators.</span>
                )}
              </p>
            </div>
          </div>

          {/* ROW 2: DEADLINES, ACTIVITY, & REPUTATION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Upcoming Deadlines Box - IMPROVED TOUCH TARGETS */}
            <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  Upcoming Deadlines
                </h4>
                <Calendar size={16} className="text-slate-400 flex-shrink-0" />
              </div>

              <div className="space-y-4">
                {deadlines.map((deadline) => (
                  <div key={deadline.id} className="flex gap-3 items-center justify-between group">
                    <div className="flex gap-3 items-center min-w-0 flex-1">
                      <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl text-center shrink-0 min-w-[44px] sm:min-w-[48px] bg-indigo-50 text-indigo-600">
                        <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">
                          {deadline.month}
                        </span>
                        <span className="text-sm sm:text-base font-bold leading-none mt-0.5">
                          {deadline.day}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-slate-800 truncate">
                          {deadline.title}
                        </h5>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {deadline.status} • {deadline.location}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCompleteDeadline(deadline.id, deadline.title)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors p-2 shrink-0 hover:bg-emerald-50 rounded-full"
                      title="Mark complete"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  </div>
                ))}

                {deadlines.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-4">All clear! 🎉</p>
                )}
              </div>
            </div>

            {/* Recent Activity Box - FIXED OVERFLOW */}
            <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  Recent Activity
                </h4>
                <button
                  type="button"
                  onClick={() => setActivities([])}
                  className="text-[10px] sm:text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-4 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 items-start">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        activity.type === "file"
                          ? "bg-indigo-50 text-indigo-600"
                          : activity.type === "system"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-[#EEF2FF] text-indigo-500"
                      }`}
                    >
                      {activity.type === "file" && <FileText size={12} />}
                      {activity.type === "system" && <CheckCircle2 size={12} />}
                      {activity.type === "chat" && <MessageSquare size={12} />}
                    </div>
                    <div className="text-xs leading-normal min-w-0 flex-1">
                      <p className="text-slate-600 break-words">
                        <span className="font-bold text-slate-800">{activity.user}</span>{" "}
                        {activity.action}{" "}
                        <span className="font-semibold text-indigo-600">{activity.target}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}

                {activities.length === 0 && (
                  <p className="py-4 text-center text-xs italic text-slate-400">
                    No recent activity.
                  </p>
                )}
              </div>
            </div>

            {/* Reputation Score Box - IMPROVED SPACING */}
            <div className="lg:col-span-3 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  Reputation Score
                </h4>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                    {reputation}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ 1000</span>
                </div>

                <div className="flex items-center gap-3 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 min-w-0">
                  <div className="p-2 bg-indigo-600 rounded-xl text-white shrink-0 shadow-sm">
                    <Award size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-800 truncate">
                      Elite Contributor
                    </h5>
                    <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                      Top 5% in CS
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium mt-4">
                <span>Performance</span>
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  ↗ High
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}