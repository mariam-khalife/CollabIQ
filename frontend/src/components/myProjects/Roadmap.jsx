import React from "react";
import { RefreshCw, Check, Rocket, Box } from "lucide-react";

const Roadmap = ({ roadmap, onRefresh }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">
          AI-Generated Roadmap
        </h3>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          Last updated: {roadmap?.lastUpdated || "2h ago"}
          <RefreshCw
            onClick={onRefresh}
            className="w-3 h-3 cursor-pointer hover:text-slate-600 transition-transform active:rotate-180"
          />
        </span>
      </div>

      <div className="my-8 relative">
        <div className="absolute top-5 left-12 right-12 h-0.5 bg-slate-100 -z-0" />

        <div className="grid grid-cols-3 text-center relative z-10">
          {/* Phase 1 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div className="pt-1">
              <h4 className="text-xs font-bold text-slate-800">Inception</h4>
              <p className="text-[10px] text-slate-400">Phase 1 • Completed</p>
            </div>
            <div className="pt-2">
              <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-xl">
                ✓ Architecture Docs
              </span>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md ring-4 ring-indigo-100">
              <Rocket className="w-5 h-5 fill-current" />
            </div>
            <div className="pt-1">
              <h4 className="text-xs font-bold text-indigo-600">Development</h4>
              <p className="text-[10px] text-indigo-500 font-medium">Phase 2 • Ongoing</p>
            </div>
            <div className="pt-2 space-y-1.5 w-full max-w-[140px]">
              <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-xl">
                • API Integration
              </div>
              <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-xl">
                • Core Logic
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="flex flex-col items-center space-y-2 opacity-60">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
              <Box className="w-5 h-5" />
            </div>
            <div className="pt-1">
              <h4 className="text-xs font-bold text-slate-700">Testing</h4>
              <p className="text-[10px] text-slate-400">Phase 3 • Future</p>
            </div>
            <div className="pt-2">
              <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 text-[11px] font-semibold rounded-xl">
                Stress Testing
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-2" />
    </div>
  );
};

export default Roadmap;