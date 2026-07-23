import React from "react";

const AIInsightCard = ({ insight, onFindMatch }) => {
  return (
    <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-md space-y-4">
      <h3 className="text-xs font-bold tracking-wide">
        {insight?.title || "AI Insight: Team Synergy"}
      </h3>
      <p className="text-xs text-indigo-100 leading-relaxed">
        {insight?.message || (
          <>
            Based on your project goals, your team needs a{" "}
            <strong className="text-white">'Cloud Architect'</strong> to bridge
            the current gap in infrastructure milestones.
          </>
        )}
      </p>
      <button
        onClick={onFindMatch}
        className="w-full py-2.5 bg-white text-indigo-600 font-bold text-xs rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer"
      >
        Find Match
      </button>
    </div>
  );
};

export default AIInsightCard;