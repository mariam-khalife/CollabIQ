import {
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";

const ActiveTasks = ({
  tasks = [],
  onAddTaskClick,
  onDeleteTask,
}) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "done":
      case "completed":
        return {
          label: "Completed",
          className:
            "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-400",
          icon: <CheckCircle className="h-3 w-3" />,
        };

      case "in_progress":
        return {
          label: "In Progress",
          className:
            "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-400",
          icon: <Clock className="h-3 w-3" />,
        };

      case "todo":
      default:
        return {
          label: "To Do",
          className:
            "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
          icon: <AlertCircle className="h-3 w-3" />,
        };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toUpperCase()) {
      case "URGENT":
        return {
          label: "Urgent",
          className:
            "border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-400",
        };

      case "LOW":
        return {
          label: "Low",
          className:
            "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-400",
        };

      case "MEDIUM":
      default:
        return {
          label: "Medium",
          className:
            "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-400",
        };
    }
  };

  const getInitials = (name) => {
    if (!name || name === "Unassigned") {
      return "?";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-1.5 dark:bg-indigo-950/50">
            <CheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>

          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
            Active Tasks
          </h3>

          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            ({tasks.length})
          </span>
        </div>

        <button
          type="button"
          onClick={onAddTaskClick}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      <div className="-mx-2 overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
              <th className="px-1.5 py-3">Task Name</th>
              <th className="px-1.5 py-3">Assigned</th>
              <th className="px-1.5 py-3">Deadline</th>
              <th className="px-1.5 py-3">Status</th>
              <th className="px-1.5 py-3">Priority</th>
              <th className="px-1.5 py-3 text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50 text-sm dark:divide-slate-800/50">
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-10 text-center text-slate-400 dark:text-slate-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-8 w-8 text-slate-300 dark:text-slate-600" />

                    <p className="text-sm font-medium">
                      No active tasks
                    </p>

                    <p className="text-xs">
                      Click &quot;Add Task&quot; to create one
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const statusStyle = getStatusStyle(
                  task.status
                );

                const priorityStyle = getPriorityStyle(
                  task.priority
                );

                return (
                  <tr
                    key={task.id}
                    className="transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-1.5 py-3.5">
                      <p className="font-bold text-slate-800 dark:text-white">
                        {task.title}
                      </p>

                      <p className="max-w-[150px] truncate text-[10px] text-slate-400 dark:text-slate-500">
                        {task.category || "Project task"}
                      </p>
                    </td>

                    <td className="px-1.5 py-3.5">
                      <div className="flex items-center gap-2">
                        {task.assignedAvatar ? (
                          <img
                            src={task.assignedAvatar}
                            alt={
                              task.assignedName ||
                              "Assigned member"
                            }
                            className="h-7 w-7 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                          />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                            {getInitials(task.assignedName)}
                          </div>
                        )}

                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {task.assignedName || "Unassigned"}
                        </span>
                      </div>
                    </td>

                    <td className="px-1.5 py-3.5">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {task.deadline || "No deadline"}
                      </span>
                    </td>

                    <td className="px-1.5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-extrabold ${statusStyle.className}`}
                      >
                        {statusStyle.icon}
                        {statusStyle.label}
                      </span>
                    </td>

                    <td className="px-1.5 py-3.5">
                      <span
                        className={`inline-flex rounded-md border px-2.5 py-1 text-[10px] font-extrabold ${priorityStyle.className}`}
                      >
                        {priorityStyle.label}
                      </span>
                    </td>

                    <td className="px-2 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          onDeleteTask(task.id)
                        }
                        className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:text-slate-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                        aria-label={`Delete ${task.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveTasks;