import React, { useState } from "react";
import { Search, HelpCircle, Bell, TrendingUp, Star } from "lucide-react";

const Reputation = () => {
  // State ready for backend API integration
  const [reputationData, setReputationData] = useState({
    tier: "ELITE RESEARCHER",
    score: 2840,
    monthlyGain: 142,
    percentile: "Top 2%",
    currentLevel: 8,
    nextLevel: 9,
    nextLevelPts: 3000,
    currentLevelPts: 2000, // level 8 start threshold
  });

  // Mentorship rating state (1-5 stars)
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);

  // Calculate dynamic progress percentage for the progress bar
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
    // Backend API hook point:
    // API.post('/reputation/mentorship-rating', { rating: newRating })
  };

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="relative w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search insights, metrics, or teams..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/70 border border-transparent rounded-full text-xs focus:outline-none focus:bg-white focus:border-indigo-600 transition-all text-slate-700 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          <button className="relative text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-8 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Reputation Score Banner (Left) */}
          <div className="lg:col-span-8 bg-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[260px]">
            {/* Top Row: Tier badge & Percentile */}
            <div className="flex items-start justify-between">
              <span className="px-3.5 py-1.5 bg-white/10 backdrop-blur-md text-[10px] font-extrabold tracking-wider rounded-full border border-white/20 uppercase">
                CURRENT TIER: {reputationData.tier}
              </span>
              <div className="text-right">
                <p className="text-[10px] font-medium text-indigo-200">
                  Percentile
                </p>
                <p className="text-2xl font-black tracking-tight">
                  {reputationData.percentile}
                </p>
              </div>
            </div>

            {/* Middle Row: Big Score */}
            <div className="my-4">
              <h1 className="text-sm font-bold text-indigo-200 mb-1">
                Reputation Score
              </h1>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-black tracking-tight">
                  {reputationData.score.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 text-xs font-extrabold bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30">
                  <TrendingUp className="w-3.5 h-3.5" />+{reputationData.monthlyGain}
                  <span className="text-[10px] font-normal text-indigo-200">
                    This Month
                  </span>
                </span>
              </div>
            </div>

            {/* Bottom Row: Level Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-indigo-900/40 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-indigo-200">
                <span>Level {reputationData.currentLevel}</span>
                <span>
                  Level {reputationData.nextLevel} (
                  {reputationData.nextLevelPts.toLocaleString()} pts)
                </span>
              </div>
            </div>
          </div>

          {/* Peer Impact Card (Right) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6 min-h-[260px] flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-indigo-950 tracking-tight">
                Peer Impact
              </h2>
            </div>

            {/* Mentorship Interactive Rating */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700">
                Mentorship Rating
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || rating)
                          ? "fill-indigo-600 text-indigo-600"
                          : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reputation;