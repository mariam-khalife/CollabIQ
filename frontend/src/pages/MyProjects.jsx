import React, { useState } from "react";
import { 
  X, 
  Search, 
  HelpCircle, 
  Bell, 
  Sparkles, 
  Plus,
  Filter,
  LayoutGrid,
  List,
  ChevronDown,
} from "lucide-react";

// Sub-components from your folder structure
import ProjectCard from "../components/myProjects/ProjectCard";
import AIInsightCard from "../components/myProjects/AIInsightCard";
import Roadmap from "../components/myProjects/Roadmap";
import ActiveTasks from "../components/myProjects/ActiveTasks";
import TeamMembers from "../components/myProjects/TeamMembers";

const MyProjects = () => {
  // State for Tasks
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Refactor Data Engine",
      category: "Backend Optimization",
      assignedName: "Sarah J.",
      assignedAvatar: "https://i.pravatar.cc/150?img=32",
      deadline: "Oct 24, 2026",
      priority: "URGENT",
    },
    {
      id: 2,
      title: "User Interface Audit",
      category: "Design Review",
      assignedName: "Kevin L.",
      assignedAvatar: "https://i.pravatar.cc/150?img=11",
      deadline: "Oct 28, 2026",
      priority: "MEDIUM",
    },
    {
      id: 3,
      title: "API Documentation",
      category: "Documentation",
      assignedName: "Maya R.",
      assignedAvatar: "https://i.pravatar.cc/150?img=5",
      deadline: "Nov 02, 2026",
      priority: "LOW",
    },
  ]);

  // State for Team Members
  const [team, setTeam] = useState([
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Lead Developer",
      contrib: "42%",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    {
      id: 2,
      name: "Kevin Lee",
      role: "UX Designer",
      contrib: "28%",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
      id: 3,
      name: "Maya Rodriguez",
      role: "Data Scientist",
      contrib: "30%",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ]);

  // View state
  const [viewMode, setViewMode] = useState("grid");

  // Modal State Controls
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Form Inputs State
  const [newTask, setNewTask] = useState({
    title: "",
    category: "Development",
    assignedName: "Sarah J.",
    deadline: "",
    priority: "MEDIUM",
  });

  const [newInvite, setNewInvite] = useState({
    name: "",
    role: "Collaborator",
  });

  // Helpers & Handlers
  const formatDate = (rawDate) => {
    if (!rawDate) return "Nov 15, 2026";
    const dateObj = new Date(rawDate);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const createdTask = {
      id: Date.now(),
      title: newTask.title,
      category: newTask.category,
      assignedName: newTask.assignedName,
      deadline: formatDate(newTask.deadline),
      priority: newTask.priority,
      assignedAvatar: "https://i.pravatar.cc/150?img=12",
    };

    setTasks([createdTask, ...tasks]);
    setNewTask({
      title: "",
      category: "Development",
      assignedName: "Sarah J.",
      deadline: "",
      priority: "MEDIUM",
    });
    setIsTaskModalOpen(false);
  };

  const handleInviteCollaborator = (e) => {
    e.preventDefault();
    if (!newInvite.name.trim()) return;

    const newMember = {
      id: Date.now(),
      name: newInvite.name,
      role: newInvite.role,
      contrib: "0%",
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}`,
    };

    setTeam([...team, newMember]);
    setNewInvite({ name: "", role: "Collaborator" });
    setIsInviteModalOpen(false);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "URGENT":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
      case "MEDIUM":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "LOW":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="flex-1 bg-slate-50/50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header Navbar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Project Workspace
          </h1>
          <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-100 dark:border-indigo-800/50 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Enhanced
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search milestones or tasks"
              className="w-full pl-9 pr-4 py-2 bg-slate-100/70 dark:bg-slate-800/70 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </button>

          <button className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
            <img
              src="https://i.pravatar.cc/150?img=68"
              alt="User"
              className="w-8 h-8 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
            />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              John D.
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <ProjectCard />
            <AIInsightCard onFindMatch={() => alert("Searching AI matches...")} />
          </div>

          <div className="lg:col-span-7">
            <Roadmap onRefresh={() => alert("Fetching updated roadmap...")} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <ActiveTasks
              tasks={tasks}
              onAddTaskClick={() => setIsTaskModalOpen(true)}
              onDeleteTask={handleDeleteTask}
            />
          </div>

          <div className="lg:col-span-4">
            <TeamMembers
              team={team}
              onInviteClick={() => setIsInviteModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isTaskModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsTaskModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200/60 dark:border-slate-800 space-y-5 animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Add New Task
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Create a new task for your project
                </p>
              </div>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Task Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Authentication"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Optimization"
                  value={newTask.category}
                  onChange={(e) =>
                    setNewTask({ ...newTask, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Due Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newTask.deadline}
                    onChange={(e) =>
                      setNewTask({ ...newTask, deadline: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all text-slate-700 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all text-slate-700 dark:text-slate-200"
                  >
                    <option value="URGENT">🔴 URGENT</option>
                    <option value="MEDIUM">🟡 MEDIUM</option>
                    <option value="LOW">🟢 LOW</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Collaborator Modal */}
      {isInviteModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsInviteModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-200/60 dark:border-slate-800 space-y-5 animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Invite Collaborator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Add a new member to your project team
                </p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteCollaborator} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={newInvite.name}
                  onChange={(e) =>
                    setNewInvite({ ...newInvite, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Role <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Backend Developer"
                  value={newInvite.role}
                  onChange={(e) =>
                    setNewInvite({ ...newInvite, role: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;