// src/pages/Reputation.jsx
import React, { useState } from "react";
import {
  TrendingUp,
  Star,
  Award,
  Users,
  Target,
  Zap,
  Crown,
  Medal,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const Reputation = () => {
  const [reputationData] = useState({
    tier: "ELITE RESEARCHER",
    score: 2840,
    monthlyGain: 142,
    percentile: "Top 2%",
    currentLevel: 8,
    nextLevel: 9,
    nextLevelPts: 3000,
    currentLevelPts: 2000,
  });

  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);

  // Calculate progress percentage
  const progressPercentage = Math.min(
    100,
    Math.max(
      0,
      ((reputationData.score - reputationData.currentLevelPts) /
        (reputationData.nextLevelPts - reputationData.currentLevelPts)) *
        100
    )
  );

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Reputation Card - Spans 2 columns */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/30 relative overflow-hidden min-h-[320px]">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl -ml-16 -mb-16" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Top Row: Tier & Percentile */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                    Current Tier
                  </p>
                  <span className="px-3.5 py-1 bg-white/10 backdrop-blur-md text-xs font-extrabold tracking-wider rounded-full border border-white/20 inline-block">
                    {reputationData.tier}
                  </span>
                </div>
              </div>
              <div className="text-right bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <p className="text-[10px] font-medium text-indigo-200">Percentile</p>
                <p className="text-xl font-black tracking-tight">{reputationData.percentile}</p>
              </div>
            </div>

            {/* Middle Row: Big Score */}
            <div className="my-4">
              <p className="text-sm font-bold text-indigo-200 mb-1">Reputation Score</p>
              <div className="flex flex-wrap items-baseline gap-3 sm:gap-6">
                <span className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
                  {reputationData.score.toLocaleString()}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-extrabold bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-400/30">
                  <TrendingUp className="w-4 h-4" />
                  +{reputationData.monthlyGain}
                  <span className="text-[10px] font-normal text-indigo-200 ml-1">
                    This Month
                  </span>
                </span>
              </div>
            </div>

            {/* Bottom Row: Level Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-indigo-200">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Level {reputationData.currentLevel}
                </span>
                <span>
                  Level {reputationData.nextLevel} (
                  {reputationData.nextLevelPts.toLocaleString()} pts)
                </span>
              </div>
              <div className="w-full bg-indigo-900/40 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="bg-gradient-to-r from-indigo-300 to-white h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-indigo-300 text-right">
                {Math.round(progressPercentage)}% to next level
              </p>
            </div>
          </div>
        </div>

        {/* Peer Impact Card - 1 column */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
                <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Peer Impact
              </h2>
            </div>

            {/* Mentorship Rating */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Mentorship Rating
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="cursor-pointer transition-all hover:scale-110 focus:outline-none p-1"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 dark:text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {rating === 5 && "⭐ Outstanding mentor!"}
                {rating === 4 && "🌟 Excellent guidance!"}
                {rating === 3 && "👍 Good mentor!"}
                {rating === 2 && "📚 Needs improvement"}
                {rating === 1 && "💪 Room for growth"}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Mentorship Sessions</span>
              <span className="font-bold text-slate-900 dark:text-white">24</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-slate-500 dark:text-slate-400">Peer Reviews Given</span>
              <span className="font-bold text-slate-900 dark:text-white">38</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[
          { icon: Award, label: "Publications", value: "24" },
          { icon: Users, label: "Teams", value: "5" },
          { icon: Target, label: "Projects", value: "12" },
          { icon: Zap, label: "AI Matches", value: "45" },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 shadow-sm text-center hover:shadow-md transition-all"
          >
            <stat.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reputation;