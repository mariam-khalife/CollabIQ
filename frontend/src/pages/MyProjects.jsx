import React, { useState } from "react";
import { X, Search, HelpCircle, Bell, Sparkles } from "lucide-react";

// Sub-components from your folder structure
import ProjectCard from "../components/myProjects/ProjectCard";
import AIInsightCard from "../components/myProjects/AIInsightCard";
import Roadmap from "../components/myProjects/Roadmap";
import ActiveTasks from "../components/myProjects/ActiveTasks";
import TeamMembers from "../components/myProjects/TeamMembers";

const MyProjects = () => {
  // State for Tasks (Backend Ready: replace initial state with API response)
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

    // DB Hook point: API.post('/tasks', createdTask)
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
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`,
    };

    // DB Hook point: API.post('/team/invite', newMember)
    setTeam([...team, newMember]);
    setNewInvite({ name: "", role: "Collaborator" });
    setIsInviteModalOpen(false);
  };

  const handleDeleteTask = (id) => {
    // DB Hook point: API.delete(`/tasks/${id}`)
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="flex-1 bg-[#f8fafc] min-h-screen">
      {/* Target Top Header Navbar */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            My Project Workspace
          </h1>
          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Enhanced
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search milestones or tasks"
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <HelpCircle className="w-5 h-5" />
          </button>

          <button className="relative text-slate-400 hover:text-slate-600 cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <div className="p-8 space-y-6">
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

      {/* Dynamic Add Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Add New Task</h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Task Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Authentication"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Optimization"
                  value={newTask.category}
                  onChange={(e) =>
                    setNewTask({ ...newTask, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newTask.deadline}
                    onChange={(e) =>
                      setNewTask({ ...newTask, deadline: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="URGENT">URGENT</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Invite Collaborator Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">
                Invite Collaborator
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleInviteCollaborator}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={newInvite.name}
                  onChange={(e) =>
                    setNewInvite({ ...newInvite, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Backend Developer"
                  value={newInvite.role}
                  onChange={(e) =>
                    setNewInvite({ ...newInvite, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 cursor-pointer"
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