import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  History,
  Loader2,
  Medal,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import { getMyReputation } from "../services/reputationService";

const LEVELS = [
  {
    name: "New Member",
    minimum: 0,
    nextMinimum: 100,
  },
  {
    name: "Growing Contributor",
    minimum: 100,
    nextMinimum: 250,
  },
  {
    name: "Reliable Teammate",
    minimum: 250,
    nextMinimum: 500,
  },
  {
    name: "Active Contributor",
    minimum: 500,
    nextMinimum: 800,
  },
  {
    name: "Top Contributor",
    minimum: 800,
    nextMinimum: null,
  },
];

const EVENT_DETAILS = {
  task_completed: {
    title: "Task completed",
    description: "Successfully completed an assigned task.",
    icon: CheckCircle2,
  },
  project_completed: {
    title: "Project completed",
    description: "Contributed to the successful completion of a project.",
    icon: Award,
  },
  team_joined: {
    title: "Joined a project team",
    description: "Accepted an invitation and joined a team.",
    icon: Users,
  },
  positive_feedback: {
    title: "Positive feedback",
    description: "Received positive feedback for a contribution.",
    icon: TrendingUp,
  },
  deadline_missed: {
    title: "Deadline missed",
    description: "An assigned task was not completed before its deadline.",
    icon: AlertCircle,
  },
  left_project_early: {
    title: "Left project early",
    description: "Left a project before its completion.",
    icon: TrendingDown,
  },
};

const Reputation = () => {
  const [reputationData, setReputationData] =
    useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadReputation = async ({
    refreshing = false,
  } = {}) => {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage("");

      const data = await getMyReputation();

      setReputationData(data);
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to load your reputation information."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadReputation();
  }, []);

  const currentLevel = useMemo(() => {
    if (!reputationData) {
      return LEVELS[0];
    }

    return (
      LEVELS.find(
        (level) =>
          level.name === reputationData.level
      ) || LEVELS[0]
    );
  }, [reputationData]);

  const progressPercentage = useMemo(() => {
    if (!reputationData) {
      return 0;
    }

    if (currentLevel.nextMinimum === null) {
      return 100;
    }

    const pointsInsideLevel =
      reputationData.score -
      currentLevel.minimum;

    const pointsRequired =
      currentLevel.nextMinimum -
      currentLevel.minimum;

    if (pointsRequired <= 0) {
      return 100;
    }

    return Math.min(
      100,
      Math.max(
        0,
        (pointsInsideLevel / pointsRequired) * 100
      )
    );
  }, [currentLevel, reputationData]);

  const pointsToNextLevel = useMemo(() => {
    if (
      !reputationData ||
      currentLevel.nextMinimum === null
    ) {
      return 0;
    }

    return Math.max(
      0,
      currentLevel.nextMinimum -
        reputationData.score
    );
  }, [currentLevel, reputationData]);

  const positivePoints = useMemo(() => {
    if (!reputationData?.history) {
      return 0;
    }

    return reputationData.history.reduce(
      (total, event) =>
        event.points > 0
          ? total + event.points
          : total,
      0
    );
  }, [reputationData]);

  const negativePoints = useMemo(() => {
    if (!reputationData?.history) {
      return 0;
    }

    return reputationData.history.reduce(
      (total, event) =>
        event.points < 0
          ? total + Math.abs(event.points)
          : total,
      0
    );
  }, [reputationData]);

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Unknown date";
    }

    const date = new Date(dateValue);
    const now = new Date();

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const eventDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const difference =
      today.getTime() - eventDay.getTime();

    const dayDifference = Math.round(
      difference / (1000 * 60 * 60 * 24)
    );

    if (dayDifference === 0) {
      return "Today";
    }

    if (dayDifference === 1) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getEventDetails = (activityType) => {
    return (
      EVENT_DETAILS[activityType] || {
        title: activityType
          ?.replaceAll("_", " ")
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
          ),
        description:
          "A reputation event was recorded.",
        icon: History,
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!reputationData) {
    return (
      <div className="flex min-h-[450px] items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900 dark:bg-rose-950/30">
          <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />

          <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            Reputation unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {errorMessage ||
              "Your reputation information could not be loaded."}
          </p>

          <button
            type="button"
            onClick={() => loadReputation()}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Reputation
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track the reputation points earned
              through tasks, teamwork, and project
              contributions.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadReputation({
                refreshing: true,
              })
            }
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isRefreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            {isRefreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 p-6 text-white shadow-lg sm:p-8 lg:col-span-2">
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
                      {reputationData.level}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-right">
                  <p className="text-xs text-indigo-200">
                    Positive points earned
                  </p>

                  <p className="flex items-center justify-end gap-1 text-lg font-bold text-emerald-300">
                    <TrendingUp className="h-4 w-4" />
                    +{positivePoints}
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
                <div className="flex flex-col gap-1 text-xs font-medium text-indigo-200 sm:flex-row sm:justify-between">
                  <span>{currentLevel.name}</span>

                  <span>
                    {currentLevel.nextMinimum === null
                      ? "Highest reputation level"
                      : `${currentLevel.nextMinimum.toLocaleString()} points for the next level`}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-indigo-900/40 p-0.5">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-700"
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>

                <p className="text-right text-xs text-indigo-200">
                  {currentLevel.nextMinimum === null
                    ? "You reached the highest reputation level."
                    : `${pointsToNextLevel.toLocaleString()} points needed to reach the next level`}
                </p>
              </div>
            </div>
          </section>

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
                    {reputationData.total_events}
                  </p>
                </div>

                <History className="h-5 w-5 text-indigo-500" />
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Current level
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                    {reputationData.level}
                  </p>
                </div>

                <Medal className="h-5 w-5 text-indigo-500" />
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Negative points
                  </p>

                  <p className="mt-1 text-xl font-bold text-rose-600 dark:text-rose-400">
                    -{negativePoints}
                  </p>
                </div>

                <TrendingDown className="h-5 w-5 text-rose-500" />
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Reputation History
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Recent events that changed your
                reputation score.
              </p>
            </div>

            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              {reputationData.history.length}{" "}
              {reputationData.history.length === 1
                ? "event"
                : "events"}
            </span>
          </div>

          {reputationData.history.length === 0 ? (
            <div className="py-14 text-center">
              <History className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />

              <h3 className="mt-4 font-semibold text-slate-800 dark:text-white">
                No reputation events yet
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Complete tasks and contribute to your
                team to earn reputation points.
              </p>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
              {reputationData.history.map(
                (event) => {
                  const details = getEventDetails(
                    event.activity_type
                  );

                  const EventIcon = details.icon;
                  const isPositive =
                    event.points >= 0;

                  return (
                    <article
                      key={event.id}
                      className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-start"
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isPositive
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
                        }`}
                      >
                        <EventIcon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {details.title}
                          </h3>

                          <span className="text-xs text-slate-400">
                            {formatDate(
                              event.logged_at
                            )}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {details.description}
                        </p>
                      </div>

                      <span
                        className={`self-start rounded-full px-3 py-1 text-xs font-bold ${
                          isPositive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {event.points} points
                      </span>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Reputation;