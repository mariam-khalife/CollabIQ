import React from "react";
import { Box } from "lucide-react";

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <Box className="w-5 h-5" />
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-wide">
          {project?.status || "ACTIVE"}
        </span>
      </div>

      <div>
        <h2 className="text-xl font-extrabold text-slate-800 leading-tight">
          {project?.title || "NeuralArch: Distributed Intelligence"}
        </h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          {project?.description ||
            "A collaborative framework for peer-to-peer neural network training in academic environments, focusing on low-latency edge computing."}
        </p>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-slate-50">
        <div>
          <p className="text-[10px] font-bold text-slate-400 tracking-wider">
            PROJECT READINESS
          </p>
          <p className="text-2xl font-black text-indigo-600">
            {project?.readiness || 84}%
          </p>
        </div>
        <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-slate-200 flex items-center justify-center text-[9px] font-bold text-indigo-600">
          AI Score
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;