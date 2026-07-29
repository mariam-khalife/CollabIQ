import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Loader2,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import ProjectCard from "../components/myProjects/ProjectCard";
import AIInsightCard from "../components/myProjects/AIInsightCard";
import Roadmap from "../components/myProjects/Roadmap";
import ActiveTasks from "../components/myProjects/ActiveTasks";
import TeamMembers from "../components/myProjects/TeamMembers";

import {
  getCurrentUser,
  getUserTeams,
} from "../services/userService";

import {
  getTeamMembers,
  getTeamReadiness,
} from "../services/teamService";

import { getTeamProject } from "../services/projectService";

import {
  getProjectRoadmap,
  getRoadmapProgress,
} from "../services/roadmapService";

import {
  createTask,
  deleteTask,
  getProjectTasks,
} from "../services/taskService";

const DEFAULT_TASK_FORM = {
  phase_id: "",
  assigned_to: "",
  title: "",
  description: "",
  deadline: "",
  priority: "medium",
};

export default function MyProjects() {
  const [currentUser, setCurrentUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);

  const [project, setProject] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapProgress, setRoadmapProgress] =
    useState(null);

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [readiness, setReadiness] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [isTaskModalOpen, setIsTaskModalOpen] =
    useState(false);
  const [isCreatingTask, setIsCreatingTask] =
    useState(false);

  const [newTask, setNewTask] = useState(
    DEFAULT_TASK_FORM
  );

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] =
    useState("");

  const isLeader =
    Boolean(currentUser) &&
    Boolean(activeTeam) &&
    currentUser.id === activeTeam.leader_id;

  const clearMessages = () => {
    setMessage("");
    setErrorMessage("");
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "No deadline";
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const resetTaskForm = () => {
    setNewTask(DEFAULT_TASK_FORM);
  };

  const loadProjectData = async (team) => {
    clearMessages();

    const [teamMembers, teamReadiness] =
      await Promise.all([
        getTeamMembers(team.id),
        getTeamReadiness(team.id),
      ]);

    setMembers(teamMembers);
    setReadiness(teamReadiness);

    try {
      const projectData = await getTeamProject(team.id);

      setProject(projectData);

      const projectTasks = await getProjectTasks(
        projectData.id
      );

      setTasks(projectTasks);

      try {
        const roadmapData =
          await getProjectRoadmap(projectData.id);

        setRoadmap(roadmapData);

        const progressData =
          await getRoadmapProgress(roadmapData.id);

        setRoadmapProgress(progressData);
      } catch (roadmapError) {
        const roadmapMessage =
          roadmapError.message?.toLowerCase() || "";

        if (roadmapMessage.includes("roadmap not found")) {
          setRoadmap(null);
          setRoadmapProgress(null);
        } else {
          throw roadmapError;
        }
      }
    } catch (projectError) {
      const projectMessage =
        projectError.message?.toLowerCase() || "";

      if (projectMessage.includes("project not found")) {
        setProject(null);
        setRoadmap(null);
        setRoadmapProgress(null);
        setTasks([]);
      } else {
        throw projectError;
      }
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoading(true);
        clearMessages();

        const userData = await getCurrentUser();
        setCurrentUser(userData);

        const userTeams = await getUserTeams(
          userData.id
        );

        setTeams(userTeams);

        if (userTeams.length > 0) {
          const firstTeam = userTeams[0];

          setActiveTeam(firstTeam);
          await loadProjectData(firstTeam);
        }
      } catch (error) {
        setErrorMessage(
          error.message ||
            "Unable to load project information."
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, []);

  const handleTeamChange = async (event) => {
    const selectedTeam = teams.find(
      (team) => team.id === event.target.value
    );

    if (!selectedTeam) {
      return;
    }

    try {
      setIsLoading(true);
      clearMessages();

      setActiveTeam(selectedTeam);
      setIsTaskModalOpen(false);
      resetTaskForm();

      await loadProjectData(selectedTeam);
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to load the selected project."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!activeTeam) {
      return;
    }

    try {
      setIsRefreshing(true);
      clearMessages();

      await loadProjectData(activeTeam);

      setMessage(
        "Project information refreshed successfully."
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to refresh project information."
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();

    if (!isLeader) {
      setErrorMessage(
        "Only the team leader can create tasks."
      );
      return;
    }

    if (!newTask.phase_id) {
      setErrorMessage(
        "Select a roadmap phase for the task."
      );
      return;
    }

    if (!newTask.title.trim()) {
      setErrorMessage("Enter a task title.");
      return;
    }

    try {
      setIsCreatingTask(true);
      clearMessages();

      const createdTask = await createTask({
        phase_id: newTask.phase_id,
        assigned_to:
          newTask.assigned_to || null,
        title: newTask.title.trim(),
        description:
          newTask.description.trim() || null,
        deadline: newTask.deadline || null,
        priority: newTask.priority,
      });

      setTasks((currentTasks) => [
        createdTask,
        ...currentTasks,
      ]);

      resetTaskForm();
      setIsTaskModalOpen(false);
      setMessage("Task created successfully.");

      if (roadmap?.id) {
        try {
          const progressData =
            await getRoadmapProgress(roadmap.id);

          setRoadmapProgress(progressData);
        } catch {
          // The task was created successfully even if
          // the progress refresh temporarily fails.
        }
      }
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to create the task."
      );
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!isLeader) {
      setErrorMessage(
        "Only the team leader can delete tasks."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();

      await deleteTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== taskId
        )
      );

      setMessage("Task deleted successfully.");

      if (roadmap?.id) {
        try {
          const progressData =
            await getRoadmapProgress(roadmap.id);

          setRoadmapProgress(progressData);
        } catch {
          // Task deletion succeeded even if
          // the progress refresh temporarily fails.
        }
      }
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to delete this task."
      );
    }
  };

  const openTaskModal = () => {
    clearMessages();

    if (!isLeader) {
      setErrorMessage(
        "Only the team leader can create tasks."
      );
      return;
    }

    if (!roadmap) {
      setErrorMessage(
        "Create a roadmap before adding tasks."
      );
      return;
    }

    if (!roadmap.phases?.length) {
      setErrorMessage(
        "The roadmap must contain at least one phase."
      );
      return;
    }

    setNewTask((currentTask) => ({
      ...currentTask,
      phase_id:
        currentTask.phase_id ||
        roadmap.phases[0].id,
    }));

    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    if (isCreatingTask) {
      return;
    }

    setIsTaskModalOpen(false);
    resetTaskForm();
  };

  const filteredTasks = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => {
      const assignedMember = 
        task.assigned_to === currentUser?.id
        ?{
          full_name: currentUser.full_name,
          role_name: "Team Leader",
        }
        :members.find(
          (member) =>
            member.user_id === task.assigned_to
      );

      return (
        task.title
          ?.toLowerCase()
          .includes(query) ||
        task.description
          ?.toLowerCase()
          .includes(query) ||
        task.status
          ?.toLowerCase()
          .includes(query) ||
        task.priority
          ?.toLowerCase()
          .includes(query) ||
        assignedMember?.full_name
          ?.toLowerCase()
          .includes(query) ||
        assignedMember?.role_name
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [members, searchQuery, tasks]);

  const mappedTasks = useMemo(() => {
  return filteredTasks.map((task) => {
    const assignedMember =
      task.assigned_to === currentUser?.id
        ? {
            full_name: currentUser.full_name,
            role_name: "Team Leader",
          }
        : members.find(
            (member) =>
              member.user_id === task.assigned_to
          );

    return {
      id: task.id,
      title: task.title,
      category:
        task.description || "Project task",
      assignedName:
        assignedMember?.full_name ||
        "Unassigned",
      assignedAvatar: null,
      deadline: formatDate(task.deadline),
      status: task.status || "todo",
      priority:
        task.priority?.toUpperCase() ||
        "MEDIUM",
    };
  });
}, [currentUser, filteredTasks, members]);

  const mappedTeam = useMemo(() => {
    return members.map((member) => ({
      id: member.id,
      userId: member.user_id,
      name: member.full_name,
      role: member.role_name,
      contrib: member.has_committed
        ? "Committed"
        : "Not Committed",
      avatar: null,
    }));
  }, [members]);

  const mappedProject = project
    ? {
        title: project.title,
        description:
          project.description ||
          "No project description available.",
        status:
          project.status === "in_progress"
            ? "ACTIVE"
            : project.status?.toUpperCase(),
        readiness:
          readiness?.readiness_score ?? 0,
        teamSize:
          readiness?.member_count ??
          members.length + 1,
        startDate: "Current",
      }
    : null;

  const mappedRoadmap = roadmap
    ? {
        ...roadmap,
        progress:
          roadmapProgress?.progress_percentage ??
          0,
        lastUpdated: roadmap.created_at
          ? formatDate(roadmap.created_at)
          : "Recently",
      }
    : null;

  if (isLoading && !activeTeam) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-full text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-7xl space-y-6">
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
              View your project roadmap, tasks, team
              members, and AI-powered staffing
              recommendations.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
            {teams.length > 0 && (
              <select
                value={activeTeam?.id || ""}
                onChange={handleTeamChange}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:w-64"
              >
                {teams.map((team) => (
                  <option
                    key={team.id}
                    value={team.id}
                  >
                    {team.team_name}
                  </option>
                ))}
              </select>
            )}

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                placeholder="Search tasks or team members..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-950"
              />
            </div>
          </div>
        </div>

        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        {isLoading && activeTeam ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : teams.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 py-16 text-center dark:border-slate-700">
            <AlertCircle className="mx-auto h-9 w-9 text-slate-400" />

            <h2 className="mt-4 font-bold text-slate-900 dark:text-white">
              No team available
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Create or join a team before viewing a
              project.
            </p>
          </div>
        ) : !project ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 py-16 text-center dark:border-slate-700">
            <AlertCircle className="mx-auto h-9 w-9 text-slate-400" />

            <h2 className="mt-4 font-bold text-slate-900 dark:text-white">
              No project created for this team
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {isLeader
                ? "Create or select a project before adding a roadmap and tasks."
                : "The team leader has not created a project yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-5">
                <ProjectCard project={mappedProject} />

                <AIInsightCard
                  onFindMatch={() => {
                    window.location.href =
                      "/ai-matching";
                  }}
                />
              </div>

              <div className="lg:col-span-7">
                {roadmap ? (
                  <Roadmap
                    roadmap={mappedRoadmap}
                    onRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
                  />
                ) : (
                  <div className="flex h-full min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
                    <AlertCircle className="h-8 w-8 text-slate-400" />

                    <h3 className="mt-3 font-bold text-slate-900 dark:text-white">
                      No roadmap available
                    </h3>

                    <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                      {isLeader
                        ? "Create a roadmap for this project to define its phases and milestones."
                        : "The team leader has not created a roadmap yet."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <ActiveTasks
                  tasks={mappedTasks}
                  onAddTaskClick={openTaskModal}
                  onDeleteTask={handleDeleteTask}
                />
              </div>

              <div className="lg:col-span-4">
                <TeamMembers
                  team={mappedTeam}
                  onInviteClick={() => {
                    window.location.href =
                      "/team-management";
                  }}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {isTaskModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-slate-950/80"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeTaskModal();
            }
          }}
        >
          <div className="my-6 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add New Task
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Create and assign a task under one
                  roadmap phase.
                </p>
              </div>

              <button
                type="button"
                onClick={closeTaskModal}
                disabled={isCreatingTask}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Close task form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateTask}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Roadmap phase
                </label>

                <select
                  required
                  value={newTask.phase_id}
                  onChange={(event) =>
                    setNewTask((currentTask) => ({
                      ...currentTask,
                      phase_id: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="">
                    Select a phase
                  </option>

                  {roadmap?.phases?.map((phase) => (
                    <option
                      key={phase.id}
                      value={phase.id}
                    >
                      {phase.phase_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Task title
                </label>

                <input
                  type="text"
                  required
                  placeholder="Example: Complete API integration"
                  value={newTask.title}
                  onChange={(event) =>
                    setNewTask((currentTask) => ({
                      ...currentTask,
                      title: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </label>

                <textarea
                  rows="3"
                  placeholder="Describe the expected work..."
                  value={newTask.description}
                  onChange={(event) =>
                    setNewTask((currentTask) => ({
                      ...currentTask,
                      description: event.target.value,
                    }))
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Assigned member
                </label>

                <select
                  value={newTask.assigned_to}
                  onChange={(event) =>
                    setNewTask((currentTask) => ({
                      ...currentTask,
                      assigned_to:
                        event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="">Unassigned</option>
                  
                  {currentUser && (
                    <option value={currentUser.id}>
                      {currentUser.full_name} — Team Leader
                    </option>
                  )}
                  {members
                    .filter(
                      (member) => member.user_id !== currentUser?.id
                    )
                    .map((member) => (
                      <option
                        key={member.user_id}
                        value={member.user_id}
                      >
                        {member.full_name} — {member.role_name}
                      </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Priority
                </label>

                <select
                  value={newTask.priority}
                  onChange={(event) =>
                    setNewTask((currentTask) => ({
                      ...currentTask,
                      priority: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="urgent">
                    Urgent
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Deadline
                </label>

                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(event) =>
                    setNewTask((currentTask) => ({
                      ...currentTask,
                      deadline: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeTaskModal}
                  disabled={isCreatingTask}
                  className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreatingTask}
                  className="flex min-w-32 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreatingTask && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {isCreatingTask
                    ? "Creating..."
                    : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}