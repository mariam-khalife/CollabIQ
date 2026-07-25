import React from "react";
import { Brain, Sparkles, Users, ArrowRight, Zap } from "lucide-react";

const AIInsightCard = ({ insight, onFindMatch }) => {
  const defaultInsight = {
    title: "AI Insight: Team Synergy",
    message: (
      <>
        Based on your project goals, your team needs a{" "}
        <strong className="text-white">'Cloud Architect'</strong> to bridge
        the current gap in infrastructure milestones.
      </>
    ),
  };

  const data = { ...defaultInsight, ...insight };

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/30 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/40">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <Brain className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-extrabold tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            {data.title}
          </h3>
        </div>

        <p className="text-sm text-indigo-100/90 leading-relaxed">
          {data.message}
        </p>

        <div className="flex items-center gap-3 mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="p-1.5 bg-emerald-400/20 rounded-lg">
            <Zap className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-indigo-200 font-medium">AI Confidence</p>
            <p className="text-xs font-bold text-white">94% match probability</p>
          </div>
        </div>

        <button
          onClick={onFindMatch}
          className="w-full mt-4 py-2.5 bg-white text-indigo-600 dark:text-indigo-700 font-extrabold text-sm rounded-xl hover:bg-indigo-50 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
        >
          <Users className="w-4 h-4 transition-transform group-hover:scale-110" />
          Find Match
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default AIInsightCard;