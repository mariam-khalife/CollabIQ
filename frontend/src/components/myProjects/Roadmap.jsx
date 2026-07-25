import React from "react";
import { RefreshCw, Check, Rocket, Box, Clock, Target, Zap } from "lucide-react";

const Roadmap = ({ roadmap, onRefresh }) => {
  const phases = [
    {
      name: "Inception",
      status: "Completed",
      icon: Check,
      color: "bg-emerald-600",
      ringColor: "ring-emerald-100 dark:ring-emerald-900/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
      items: ["Architecture Docs", "Tech Stack Setup"],
      progress: 100,
    },
    {
      name: "Development",
      status: "Ongoing",
      icon: Rocket,
      color: "bg-indigo-600",
      ringColor: "ring-indigo-100 dark:ring-indigo-900/30",
      textColor: "text-indigo-600 dark:text-indigo-400",
      items: ["API Integration", "Core Logic", "UI Development"],
      progress: 65,
    },
    {
      name: "Testing",
      status: "Future",
      icon: Box,
      color: "bg-slate-300 dark:bg-slate-600",
      ringColor: "ring-slate-100 dark:ring-slate-800",
      textColor: "text-slate-400 dark:text-slate-500",
      items: ["Stress Testing", "User Acceptance"],
      progress: 0,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
              <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
              AI-Generated Roadmap
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Last updated: {roadmap?.lastUpdated || "2h ago"}
            <RefreshCw
              onClick={onRefresh}
              className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-all hover:rotate-180 active:scale-90"
            />
          </span>
        </div>

        <div className="my-8 relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-12 right-12 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0">
            <div 
              className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-500"
              style={{ width: '65%' }}
            />
          </div>

          <div className="grid grid-cols-3 text-center relative z-10 gap-4">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isActive = index === 1;
              const isCompleted = index === 0;
              
              return (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div 
                    className={`w-12 h-12 rounded-full ${phase.color} text-white flex items-center justify-center shadow-lg transition-all ${
                      isActive ? 'scale-110 ring-4 ring-indigo-200 dark:ring-indigo-900/30' : ''
                    } ${isCompleted ? 'shadow-emerald-500/30' : ''}`}
                  >
                    <Icon className={`w-5 h-5 ${isCompleted ? 'stroke-[3]' : ''}`} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-extrabold ${isActive ? phase.textColor : 'text-slate-700 dark:text-slate-300'}`}>
                      {phase.name}
                    </h4>
                    <p className={`text-[10px] font-medium ${
                      isCompleted ? 'text-emerald-600 dark:text-emerald-400' :
                      isActive ? 'text-indigo-600 dark:text-indigo-400' :
                      'text-slate-400 dark:text-slate-500'
                    }`}>
                      {phase.status}
                    </p>
                  </div>
                  <div className="pt-2 w-full max-w-[140px] space-y-1.5">
                    {phase.items.map((item, i) => (
                      <div 
                        key={i}
                        className={`px-3 py-1.5 text-[11px] font-semibold rounded-xl transition-all ${
                          isCompleted || isActive
                            ? 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            : 'bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-60'
                        }`}
                      >
                        {isCompleted && <Check className="w-3 h-3 inline mr-1 text-emerald-500" />}
                        {item}
                      </div>
                    ))}
                  </div>
                  {isActive && (
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-700"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;