import React, { useState } from "react";
import { Plus, Trash2, MoreVertical, CheckCircle, Clock, AlertCircle } from "lucide-react";

const ActiveTasks = ({ tasks, onAddTaskClick, onDeleteTask }) => {
  const [expandedTask, setExpandedTask] = useState(null);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "URGENT":
        return {
          bg: "bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50",
          dot: "bg-rose-500",
          icon: <AlertCircle className="w-3 h-3" />,
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
          dot: "bg-amber-500",
          icon: <Clock className="w-3 h-3" />,
        };
      case "LOW":
        return {
          bg: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
          dot: "bg-emerald-500",
          icon: <CheckCircle className="w-3 h-3" />,
        };
      default:
        return {
          bg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
          dot: "bg-slate-400",
          icon: null,
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
            <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
            Active Tasks
          </h3>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            ({tasks.length})
          </span>
        </div>
        <button
          onClick={onAddTaskClick}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-2">Task Name</th>
              <th className="py-3 px-2">Assigned</th>
              <th className="py-3 px-2">Deadline</th>
              <th className="py-3 px-2">Priority</th>
              <th className="py-3 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-sm">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-medium">No active tasks</p>
                    <p className="text-xs">Click "Add Task" to create one</p>
                  </div>
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const priority = getPriorityStyle(task.priority);
                return (
                  <tr key={task.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-slate-800 dark:text-white">
                        {task.title}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {task.category}
                      </p>
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={task.assignedAvatar}
                          alt={task.assignedName}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                          {task.assignedName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {task.deadline}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-md border ${priority.bg}`}
                      >
                        {priority.icon}
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
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