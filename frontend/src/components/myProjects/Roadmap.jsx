import {
  Box,
  Check,
  Clock,
  RefreshCw,
  Rocket,
  Target,
} from "lucide-react";

const Roadmap = ({ roadmap, onRefresh }) => {
  const phases = [...(roadmap?.phases || [])].sort(
    (firstPhase, secondPhase) =>
      firstPhase.phase_order - secondPhase.phase_order
  );

  const progress = roadmap?.progress ?? 0;

  const getPhasePresentation = (status) => {
    if (status === "done") {
      return {
        label: "Completed",
        icon: Check,
        circleClass:
          "bg-emerald-600 text-white shadow-emerald-500/30",
        titleClass:
          "text-emerald-600 dark:text-emerald-400",
        statusClass:
          "text-emerald-600 dark:text-emerald-400",
      };
    }

    if (status === "in_progress") {
      return {
        label: "In Progress",
        icon: Rocket,
        circleClass:
          "bg-indigo-600 text-white ring-4 ring-indigo-200 dark:ring-indigo-900/30",
        titleClass:
          "text-indigo-600 dark:text-indigo-400",
        statusClass:
          "text-indigo-600 dark:text-indigo-400",
      };
    }

    return {
      label: "Not Started",
      icon: Box,
      circleClass:
        "bg-slate-300 text-white dark:bg-slate-600",
      titleClass:
        "text-slate-700 dark:text-slate-300",
      statusClass:
        "text-slate-400 dark:text-slate-500",
    };
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "No target date";
    }

    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-1.5 dark:bg-indigo-950/50">
            <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
              Project Roadmap
            </h3>

            <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
              {phases.length} phase
              {phases.length === 1 ? "" : "s"} · {progress}% complete
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
          <Clock className="h-3 w-3" />

          <span>
            Last updated: {roadmap?.lastUpdated || "Recently"}
          </span>

          <button
            type="button"
            onClick={onRefresh}
            className="rounded-md p-1 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Refresh roadmap"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {phases.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-16 text-center">
          <div>
            <Target className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />

            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
              No roadmap phases available.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
              style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
              }}
            />
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {phases.map((phase) => {
              const presentation = getPhasePresentation(
                phase.status
              );
              const Icon = presentation.icon;

              return (
                <article
                  key={phase.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center dark:border-slate-700 dark:bg-slate-800/40"
                >
                  <div
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full shadow-lg ${presentation.circleClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h4
                    className={`mt-3 text-sm font-extrabold ${presentation.titleClass}`}
                  >
                    {phase.phase_name}
                  </h4>

                  <p
                    className={`mt-1 text-[10px] font-semibold ${presentation.statusClass}`}
                  >
                    {presentation.label}
                  </p>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Target date
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {formatDate(phase.target_date)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Roadmap;