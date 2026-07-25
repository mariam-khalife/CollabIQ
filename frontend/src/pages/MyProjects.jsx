import React, { useMemo, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";

import ProjectCard from "../components/myProjects/ProjectCard";
import AIInsightCard from "../components/myProjects/AIInsightCard";
import Roadmap from "../components/myProjects/Roadmap";
import ActiveTasks from "../components/myProjects/ActiveTasks";
import TeamMembers from "../components/myProjects/TeamMembers";

const MyProjects = () => {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

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

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query) ||
        task.assignedName.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, tasks]);

  const formatDate = (rawDate) => {
    if (!rawDate) {
      return "Nov 15, 2026";
    }

    const date = new Date(rawDate);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleAddTask = (event) => {
    event.preventDefault();

    if (!newTask.title.trim()) {
      return;
    }

    const createdTask = {
      id: Date.now(),
      title: newTask.title.trim(),
      category: newTask.category.trim() || "General",
      assignedName: newTask.assignedName,
      deadline: formatDate(newTask.deadline),
      priority: newTask.priority,
      assignedAvatar: "https://i.pravatar.cc/150?img=12",
    };

    setTasks((currentTasks) => [createdTask, ...currentTasks]);

    setNewTask({
      title: "",
      category: "Development",
      assignedName: "Sarah J.",
      deadline: "",
      priority: "MEDIUM",
    });

    setIsTaskModalOpen(false);
  };

  const handleInviteCollaborator = (event) => {
    event.preventDefault();

    if (!newInvite.name.trim() || !newInvite.role.trim()) {
      return;
    }

    const newMember = {
      id: Date.now(),
      name: newInvite.name.trim(),
      role: newInvite.role.trim(),
      contrib: "0%",
      avatar: `https://i.pravatar.cc/150?img=${
        Math.floor(Math.random() * 50) + 1
      }`,
    };

    setTeam((currentTeam) => [...currentTeam, newMember]);
    setNewInvite({ name: "", role: "Collaborator" });
    setIsInviteModalOpen(false);
  };

  const handleDeleteTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  return (
    <div className="min-h-full text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-7xl space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                My Project
              </h1>

              <span className="flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                AI Team Analysis
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your project roadmap, tasks, team members, and AI-powered
              staffing recommendations.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              placeholder="Search tasks or team members..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-950"
            />
          </div>
        </div>

        {/* Project overview and roadmap */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <ProjectCard />

            <AIInsightCard
              onFindMatch={() =>
                alert("Opening recommended teammate suggestions...")
              }
            />
          </div>

          <div className="lg:col-span-7">
            <Roadmap
              onRefresh={() =>
                alert("Refreshing the project roadmap...")
              }
            />
          </div>
        </div>

        {/* Tasks and team */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ActiveTasks
              tasks={filteredTasks}
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
      </main>

      {/* Add Task Modal */}
      {isTaskModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-slate-950/80"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsTaskModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add New Task
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Add a task to the selected project roadmap.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                aria-label="Close task form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Task name
                </label>

                <input
                  type="text"
                  required
                  placeholder="Example: Implement authentication"
                  value={newTask.title}
                  onChange={(event) =>
                    setNewTask({
                      ...newTask,
                      title: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>

                <input
                  type="text"
                  placeholder="Example: Backend development"
                  value={newTask.category}
                  onChange={(event) =>
                    setNewTask({
                      ...newTask,
                      category: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Assigned member
                </label>

                <select
                  value={newTask.assignedName}
                  onChange={(event) =>
                    setNewTask({
                      ...newTask,
                      assignedName: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {team.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Deadline
                  </label>

                  <input
                    type="date"
                    required
                    value={newTask.deadline}
                    onChange={(event) =>
                      setNewTask({
                        ...newTask,
                        deadline: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Priority
                  </label>

                  <select
                    value={newTask.priority}
                    onChange={(event) =>
                      setNewTask({
                        ...newTask,
                        priority: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="URGENT">Urgent</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-slate-950/80"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsInviteModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Invite Collaborator
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Add a new member to the project team.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                aria-label="Close invitation form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleInviteCollaborator}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full name
                </label>

                <input
                  type="text"
                  required
                  placeholder="Example: Jordan Miller"
                  value={newInvite.name}
                  onChange={(event) =>
                    setNewInvite({
                      ...newInvite,
                      name: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Project role
                </label>

                <input
                  type="text"
                  required
                  placeholder="Example: Cloud Architect"
                  value={newInvite.role}
                  onChange={(event) =>
                    setNewInvite({
                      ...newInvite,
                      role: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Send Invitation
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