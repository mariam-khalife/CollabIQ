import React, { useMemo, useState } from "react";
import {
  Award,
  CheckCircle2,
  History,
  Medal,
  TrendingUp,
  Users,
} from "lucide-react";

const Reputation = () => {
  // Temporary UI data.
  // This will later be replaced with data from the Reputation API.
  const [reputationData] = useState({
    score: 2840,
    level: 8,
    nextLevel: 9,
    currentLevelMinimum: 2000,
    nextLevelMinimum: 3000,
    monthlyGain: 142,
    totalEvents: 18,
  });

  const [history] = useState([
    {
      id: 1,
      type: "task_completed",
      title: "Task completed",
      description: 'Completed the task "API Documentation".',
      points: 20,
      date: "Today",
    },
    {
      id: 2,
      type: "team_joined",
      title: "Joined a project team",
      description: 'Joined the team working on "NeuralArch".',
      points: 15,
      date: "Yesterday",
    },
    {
      id: 3,
      type: "task_completed",
      title: "Task completed",
      description: 'Completed the task "Database Integration".',
      points: 20,
      date: "Jul 22, 2026",
    },
  ]);

  const progressPercentage = useMemo(() => {
    const currentProgress =
      reputationData.score - reputationData.currentLevelMinimum;

    const requiredProgress =
      reputationData.nextLevelMinimum -
      reputationData.currentLevelMinimum;

    if (requiredProgress <= 0) {
      return 100;
    }

    return Math.min(
      100,
      Math.max(0, (currentProgress / requiredProgress) * 100)
    );
  }, [reputationData]);

  const pointsToNextLevel = Math.max(
    0,
    reputationData.nextLevelMinimum - reputationData.score
  );

  return (
    <div className="min-h-full text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-7xl space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reputation
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track the reputation points earned through tasks, teamwork, and
            project contributions.
          </p>
        </div>

        {/* Main reputation overview */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 p-6 text-white shadow-lg lg:col-span-2 sm:p-8">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />

            <div className="relative space-y-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-white/20 bg-white/10 p-2">
                    <Medal className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-indigo-200">
                      Current level
                    </p>

                    <p className="text-xl font-bold">
                      Level {reputationData.level}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-right">
                  <p className="text-xs text-indigo-200">
                    Points earned this month
                  </p>

                  <p className="flex items-center justify-end gap-1 text-lg font-bold text-emerald-300">
                    <TrendingUp className="h-4 w-4" />
                    +{reputationData.monthlyGain}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-indigo-200">
                  Reputation score
                </p>

                <p className="mt-1 text-5xl font-black tracking-tight sm:text-6xl">
                  {reputationData.score.toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-medium text-indigo-200">
                  <span>Level {reputationData.level}</span>

                  <span>
                    Level {reputationData.nextLevel} ·{" "}
                    {reputationData.nextLevelMinimum.toLocaleString()} points
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-indigo-900/40 p-0.5">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-700"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <p className="text-right text-xs text-indigo-200">
                  {pointsToNextLevel.toLocaleString()} points needed to reach
                  the next level
                </p>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-2 dark:bg-indigo-950/50">
                <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Reputation Summary
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Total events
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                    {reputationData.totalEvents}
                  </p>
                </div>

                <History className="h-5 w-5 text-indigo-500" />
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Current level
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                    {reputationData.level}
                  </p>
                </div>

                <Medal className="h-5 w-5 text-indigo-500" />
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monthly gain
                  </p>

                  <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    +{reputationData.monthlyGain}
                  </p>
                </div>

                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </section>
        </div>

        {/* Reputation history */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Reputation History
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Recent events that changed your reputation score.
              </p>
            </div>

            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              {history.length} recent events
            </span>
          </div>

          <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
            {history.map((event) => (
              <article
                key={event.id}
                className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-start"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                  {event.type === "team_joined" ? (
                    <Users className="h-5 w-5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {event.title}
                    </h3>

                    <span className="text-xs text-slate-400">
                      {event.date}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {event.description}
                  </p>
                </div>

                <span className="self-start rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  +{event.points} points
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Reputation;