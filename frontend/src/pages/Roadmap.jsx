
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  getCurrentUser,
  getUserTeams,
} from "../services/userService";

import {
  getTeamMembers,
} from "../services/teamService";

import {
  getTeamProject,
} from "../services/projectService";

import {
  addRoadmapPhase,
  createRoadmap,
  getProjectRoadmap,
  getRoadmapProgress,
  updatePhaseStatus,
} from "../services/roadmapService";

import {
  createTask,
  deleteTask,
  getProjectTasks,
  updateTaskStatus,
} from "../services/taskService";

const EMPTY_TASK_FORM = {
  title: "",
  description: "",
  deadline: "",
  priority: "medium",
  assigned_to: "",
};

const EMPTY_PHASE_FORM = {
  phase_name: "",
  target_date: "",
};

export default function Roadmap() {
  const [currentUser, setCurrentUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);

  const [project, setProject] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPhaseIds, setExpandedPhaseIds] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [phaseForm, setPhaseForm] = useState(EMPTY_PHASE_FORM);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState("");
  const [taskForm, setTaskForm] = useState(EMPTY_TASK_FORM);

  const isLeader =
    Boolean(currentUser) &&
    Boolean(activeTeam) &&
    String(currentUser.id) === String(activeTeam.leader_id);

  const clearMessages = () => {
    setMessage("");
    setErrorMessage("");
  };

  const isNotFound = (error, text) =>
    (error?.message || "").toLowerCase().includes(text);

  const formatDate = (value) => {
    if (!value) {
      return "No target date";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const loadTeamData = async (team) => {
    setProject(null);
    setRoadmap(null);
    setProgress(null);
    setTasks([]);
    setMembers([]);
    setExpandedPhaseIds([]);

    const membersData = await getTeamMembers(team.id);
    setMembers(membersData);

    let projectData;

    try {
      projectData = await getTeamProject(team.id);
      setProject(projectData);
    } catch (error) {
      if (isNotFound(error, "project not found")) {
        return;
      }

      throw error;
    }

    const projectTasks = await getProjectTasks(projectData.id);
    setTasks(projectTasks);

    try {
      const roadmapData = await getProjectRoadmap(projectData.id);
      setRoadmap(roadmapData);

      const progressData = await getRoadmapProgress(roadmapData.id);
      setProgress(progressData);

      const firstPhase = [...(roadmapData.phases || [])].sort(
        (first, second) =>
          first.phase_order - second.phase_order
      )[0];

      if (firstPhase) {
        setExpandedPhaseIds([firstPhase.id]);
      }
    } catch (error) {
      if (isNotFound(error, "roadmap not found")) {
        return;
      }

      throw error;
    }
  };

  const initializePage = async () => {
    try {
      setIsLoading(true);
      clearMessages();

      const userData = await getCurrentUser();
      setCurrentUser(userData);

      const userTeams = await getUserTeams(userData.id);
      setTeams(userTeams);

      if (userTeams.length > 0) {
        const firstTeam = userTeams[0];
        setActiveTeam(firstTeam);
        await loadTeamData(firstTeam);
      }
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to load roadmap information."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializePage();
  }, []);

  const handleTeamChange = async (event) => {
    const selectedTeam = teams.find(
      (team) => String(team.id) === event.target.value
    );

    if (!selectedTeam) {
      return;
    }

    try {
      setIsRefreshing(true);
      clearMessages();
      setActiveTeam(selectedTeam);
      await loadTeamData(selectedTeam);
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to load the selected team."
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    if (!activeTeam) {
      return;
    }

    try {
      setIsRefreshing(true);
      clearMessages();
      await loadTeamData(activeTeam);
      setMessage("Roadmap refreshed successfully.");
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to refresh the roadmap."
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const togglePhase = (phaseId) => {
    setExpandedPhaseIds((currentIds) =>
      currentIds.includes(phaseId)
        ? currentIds.filter((id) => id !== phaseId)
        : [...currentIds, phaseId]
    );
  };

  const openPhaseModal = () => {
    setPhaseForm(EMPTY_PHASE_FORM);
    setShowPhaseModal(true);
    clearMessages();
  };

  const closePhaseModal = () => {
    setShowPhaseModal(false);
    setPhaseForm(EMPTY_PHASE_FORM);
  };

  const handleCreatePhase = async (event) => {
    event.preventDefault();

    if (!project) {
      setErrorMessage("A project is required before adding a phase.");
      return;
    }

    if (!phaseForm.phase_name.trim()) {
      setErrorMessage("Phase name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      clearMessages();

      if (!roadmap) {
        await createRoadmap({
          project_id: project.id,
          generated_by: "manual",
          phases: [
            {
              phase_name: phaseForm.phase_name.trim(),
              phase_order: 1,
              target_date: phaseForm.target_date || null,
            },
          ],
        });
      } else {
        await addRoadmapPhase(roadmap.id, {
          phase_name: phaseForm.phase_name.trim(),
          target_date: phaseForm.target_date || null,
        });
      }

      closePhaseModal();
      await loadTeamData(activeTeam);
      setMessage("Roadmap phase created successfully.");
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to create the roadmap phase."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhaseStatusChange = async (phaseId, status) => {
    try {
      clearMessages();
      await updatePhaseStatus(phaseId, status);
      await loadTeamData(activeTeam);
      setMessage("Phase status updated successfully.");
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to update the phase status."
      );
    }
  };

  const openTaskModal = (phaseId) => {
    setSelectedPhaseId(phaseId);
    setTaskForm(EMPTY_TASK_FORM);
    setShowTaskModal(true);
    clearMessages();
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setSelectedPhaseId("");
    setTaskForm(EMPTY_TASK_FORM);
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();

    if (!taskForm.title.trim()) {
      setErrorMessage("Task title is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      clearMessages();

      await createTask({
        phase_id: selectedPhaseId,
        title: taskForm.title.trim(),
        description: taskForm.description.trim() || null,
        deadline: taskForm.deadline || null,
        priority: taskForm.priority,
        assigned_to: taskForm.assigned_to || null,
      });

      closeTaskModal();
      await loadTeamData(activeTeam);
      setMessage("Task created successfully.");
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to create the task."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskStatusChange = async (taskId, status) => {
    try {
      clearMessages();
      await updateTaskStatus(taskId, status);
      await loadTeamData(activeTeam);
      setMessage("Task status updated successfully.");
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to update the task status."
      );
    }
  };

  const handleDeleteTask = async (task) => {
    const confirmed = window.confirm(
      `Delete the task "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();
      await deleteTask(task.id);
      await loadTeamData(activeTeam);
      setMessage("Task deleted successfully.");
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to delete the task."
      );
    }
  };

  const tasksByPhase = useMemo(() => {
    const grouped = new Map();

    tasks.forEach((task) => {
      const phaseId = String(task.phase_id);

      if (!grouped.has(phaseId)) {
        grouped.set(phaseId, []);
      }

      grouped.get(phaseId).push(task);
    });

    return grouped;
  }, [tasks]);

  const memberById = useMemo(() => {
    return new Map(
      members.map((member) => [
        String(member.user_id),
        member,
      ])
    );
  }, [members]);

  const filteredPhases = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return [...(roadmap?.phases || [])]
      .sort(
        (first, second) =>
          first.phase_order - second.phase_order
      )
      .map((phase) => {
        const phaseTasks =
          tasksByPhase.get(String(phase.id)) || [];

        return {
          ...phase,
          tasks: normalizedSearch
            ? phaseTasks.filter((task) =>
                task.title
                  ?.toLowerCase()
                  .includes(normalizedSearch)
              )
            : phaseTasks,
        };
      });
  }, [roadmap, tasksByPhase, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 text-slate-800 dark:text-slate-100">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Roadmap Management
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create and manage project phases, tasks, deadlines, and progress manually.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {teams.length > 0 && (
            <select
              value={activeTeam?.id || ""}
              onChange={handleTeamChange}
              disabled={isRefreshing}
              className="min-w-64 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.team_name}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={!activeTeam || isRefreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>

          {isLeader && project && (
            <button
              type="button"
              onClick={openPhaseModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Roadmap Phase
            </button>
          )}
        </div>
      </section>

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

      {!project ? (
        <EmptyState
          title="No project available"
          text="Create a project before building its roadmap."
        />
      ) : !roadmap ? (
        <EmptyState
          title="No roadmap created"
          text={
            isLeader
              ? "Add the first roadmap phase to create the manual roadmap."
              : "The team leader has not created the roadmap yet."
          }
          action={
            isLeader ? (
              <button
                type="button"
                onClick={openPhaseModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add First Phase
              </button>
            ) : null
          }
        />
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 p-6 dark:border-slate-800 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {project.title}
                </h2>

                <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
                  {project.description ||
                    "No project description available."}
                </p>
              </div>

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                Manual Roadmap
              </span>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-5 border-t border-slate-100 pt-6 dark:border-slate-800 md:grid-cols-4">
              <Stat
                label="Progress"
                value={`${progress?.progress_percentage ?? 0}%`}
              />
              <Stat
                label="Phases"
                value={`${progress?.total_phases ?? roadmap.phases.length} total`}
              />
              <Stat
                label="Completed"
                value={`${progress?.completed_phases ?? 0} phases`}
              />
              <Stat
                label="Tasks"
                value={`${progress?.total_tasks ?? tasks.length} total`}
              />
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{
                  width: `${Math.min(
                    Math.max(
                      progress?.progress_percentage ?? 0,
                      0
                    ),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/30">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search roadmap tasks..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="space-y-5 p-6 md:p-8">
            {filteredPhases.map((phase) => {
              const isExpanded =
                expandedPhaseIds.includes(phase.id);

              return (
                <article
                  key={phase.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800"
                >
                  <button
                    type="button"
                    onClick={() => togglePhase(phase.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          Phase {phase.phase_order}: {phase.phase_name}
                        </h3>

                        <StatusBadge status={phase.status} />
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(phase.target_date)}
                        </span>

                        <span>
                          {phase.tasks.length}{" "}
                          {phase.tasks.length === 1
                            ? "task"
                            : "tasks"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isLeader && (
                        <select
                          value={phase.status}
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                          onChange={(event) =>
                            handlePhaseStatusChange(
                              phase.id,
                              event.target.value
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="todo">Not Started</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Completed</option>
                        </select>
                      )}

                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-200 dark:border-slate-800">
                      {phase.tasks.length === 0 ? (
                        <p className="p-6 text-center text-sm text-slate-400">
                          No tasks created for this phase.
                        </p>
                      ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                          {phase.tasks.map((task) => {
                            const member = memberById.get(
                              String(task.assigned_to)
                            );

                            const canUpdate =
                              isLeader ||
                              String(task.assigned_to) ===
                                String(currentUser?.id);

                            return (
                              <div
                                key={task.id}
                                className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
                              >
                                <div>
                                  <p
                                    className={`font-semibold ${
                                      task.status === "done"
                                        ? "text-slate-400 line-through"
                                        : "text-slate-800 dark:text-slate-200"
                                    }`}
                                  >
                                    {task.title}
                                  </p>

                                  {task.description && (
                                    <p className="mt-1 text-xs text-slate-400">
                                      {task.description}
                                    </p>
                                  )}
                                </div>

                                <p className="text-xs text-slate-500">
                                  {member?.full_name ||
                                    (String(task.assigned_to) ===
                                    String(activeTeam?.leader_id)
                                      ? currentUser?.full_name
                                      : "Unassigned")}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {formatDate(task.deadline)}
                                </p>

                                <select
                                  value={task.status}
                                  disabled={!canUpdate}
                                  onChange={(event) =>
                                    handleTaskStatusChange(
                                      task.id,
                                      event.target.value
                                    )
                                  }
                                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold outline-none disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800"
                                >
                                  <option value="todo">To Do</option>
                                  <option value="in_progress">
                                    In Progress
                                  </option>
                                  <option value="done">Done</option>
                                </select>

                                {isLeader && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteTask(task)
                                    }
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {isLeader && (
                        <div className="border-t border-slate-100 bg-indigo-50/30 p-3 text-center dark:border-slate-800 dark:bg-indigo-950/10">
                          <button
                            type="button"
                            onClick={() =>
                              openTaskModal(phase.id)
                            }
                            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-300"
                          >
                            <Plus className="h-4 w-4" />
                            Add Task
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {showPhaseModal && (
        <Modal
          title="Add Roadmap Phase"
          description="Create a new manual phase for this project roadmap."
          onClose={closePhaseModal}
        >
          <form
            onSubmit={handleCreatePhase}
            className="space-y-5"
          >
            <FormField label="Phase name">
              <input
                type="text"
                value={phaseForm.phase_name}
                onChange={(event) =>
                  setPhaseForm((current) => ({
                    ...current,
                    phase_name: event.target.value,
                  }))
                }
                placeholder="Example: Testing and QA"
                required
                className={inputClassName}
              />
            </FormField>

            <FormField label="Target date">
              <input
                type="date"
                value={phaseForm.target_date}
                onChange={(event) =>
                  setPhaseForm((current) => ({
                    ...current,
                    target_date: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </FormField>

            <ModalActions
              onCancel={closePhaseModal}
              isSubmitting={isSubmitting}
              submitLabel="Create Phase"
            />
          </form>
        </Modal>
      )}

      {showTaskModal && (
        <Modal
          title="Create Task"
          description="Add a task to the selected roadmap phase."
          onClose={closeTaskModal}
        >
          <form
            onSubmit={handleCreateTask}
            className="space-y-5"
          >
            <FormField label="Task title">
              <input
                type="text"
                value={taskForm.title}
                onChange={(event) =>
                  setTaskForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                required
                className={inputClassName}
              />
            </FormField>

            <FormField label="Description">
              <textarea
                rows="3"
                value={taskForm.description}
                onChange={(event) =>
                  setTaskForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Deadline">
                <input
                  type="date"
                  value={taskForm.deadline}
                  onChange={(event) =>
                    setTaskForm((current) => ({
                      ...current,
                      deadline: event.target.value,
                    }))
                  }
                  className={inputClassName}
                />
              </FormField>

              <FormField label="Priority">
                <select
                  value={taskForm.priority}
                  onChange={(event) =>
                    setTaskForm((current) => ({
                      ...current,
                      priority: event.target.value,
                    }))
                  }
                  className={inputClassName}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="urgent">Urgent</option>
                </select>
              </FormField>
            </div>

            <FormField label="Assign to">
              <select
                value={taskForm.assigned_to}
                onChange={(event) =>
                  setTaskForm((current) => ({
                    ...current,
                    assigned_to: event.target.value,
                  }))
                }
                className={inputClassName}
              >
                <option value="">Unassigned</option>

                {currentUser && (
                  <option value={currentUser.id}>
                    {currentUser.full_name} — Team Leader
                  </option>
                )}

                {members.map((member) => (
                  <option
                    key={member.user_id}
                    value={member.user_id}
                  >
                    {member.full_name} — {member.role_name}
                  </option>
                ))}
              </select>
            </FormField>

            <ModalActions
              onCancel={closeTaskModal}
              isSubmitting={isSubmitting}
              submitLabel="Create Task"
            />
          </form>
        </Modal>
      )}
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-indigo-950";

function EmptyState({ title, text, action = null }) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <Circle className="mx-auto h-10 w-10 text-slate-300" />

      <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
        {text}
      </p>

      {action}
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    done: {
      label: "Completed",
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    in_progress: {
      label: "In Progress",
      className:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
    },
    todo: {
      label: "Not Started",
      className:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    },
  };

  const item = config[status] || config.todo;

  return (
    <span
      className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${item.className}`}
    >
      {item.label}
    </span>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </span>

      {children}
    </label>
  );
}

function Modal({
  title,
  description,
  onClose,
  children,
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function ModalActions({
  onCancel,
  isSubmitting,
  submitLabel,
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {submitLabel}
      </button>
    </div>
  );
}