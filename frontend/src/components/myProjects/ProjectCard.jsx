import React from "react";
import { Box, TrendingUp, Users, Calendar, Sparkles } from "lucide-react";

const ProjectCard = ({ project }) => {
  const defaultProject = {
    title: "NeuralArch: Distributed Intelligence",
    description: "A collaborative framework for peer-to-peer neural network training in academic environments, focusing on low-latency edge computing.",
    status: "ACTIVE",
    readiness: 84,
    teamSize: 6,
    startDate: "Jan 2024",
  };

  const data = { ...defaultProject, ...project };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50";
      case "COMPLETED":
        return "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50";
      case "PAUSED":
        return "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50";
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
          <Box className="w-5 h-5" />
        </div>
        <span className={`px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wide ${getStatusColor(data.status)}`}>
          <Sparkles className="w-3 h-3 inline mr-1" />
          {data.status}
        </span>
      </div>

      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {data.title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          {data.description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Readiness
          </p>
          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">
            {data.readiness}%
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3 h-3" />
            Team
          </p>
          <p className="text-lg font-black text-slate-800 dark:text-white">
            {data.teamSize}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Started
          </p>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {data.startDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;