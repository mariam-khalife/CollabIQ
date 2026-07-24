import React from "react";
import { Plus, Trash2 } from "lucide-react";

const ActiveTasks = ({ tasks, onAddTaskClick, onDeleteTask }) => {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "URGENT":
        return "bg-rose-100 text-rose-600 border-rose-200";
      case "MEDIUM":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "LOW":
        return "bg-emerald-100 text-emerald-600 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">Active Tasks</h3>
        <button
          onClick={onAddTaskClick}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-2">Task Name</th>
              <th className="py-3 px-2">Assigned</th>
              <th className="py-3 px-2">Deadline</th>
              <th className="py-3 px-2">Priority</th>
              <th className="py-3 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50/50">
                <td className="py-3.5 px-2">
                  <p className="font-bold text-slate-800">{task.title}</p>
                  <p className="text-[10px] text-slate-400">{task.category}</p>
                </td>
                <td className="py-3.5 px-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={task.assignedAvatar}
                      alt={task.assignedName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-semibold text-slate-700">
                      {task.assignedName}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-2 text-slate-500 font-medium">
                  {task.deadline}
                </td>
                <td className="py-3.5 px-2">
                  <span
                    className={`px-2.5 py-1 text-[9px] font-extrabold rounded-md border ${getPriorityStyle(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="py-3.5 px-2 text-right">
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveTasks;