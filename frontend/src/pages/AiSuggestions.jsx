import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Loader2,
  Rocket,
  Search,
  Sparkles,
  Target,
  ThumbsUp,
  X,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser, getUserTeams } from "../services/userService";
import {
  generateProjectRecommendations,
  getProjectRecommendations,
} from "../services/projectRecommendationService";
import { createProject, getTeamProject } from "../services/projectService";

const ALL_TAB = "allsuggestions";
const SAVED_TAB = "savedideas";

const normalizeDifficulty = (difficulty) => {
  const value = (difficulty || "").toLowerCase();

  if (value === "beginner") return "Easy";
  if (value === "intermediate") return "Medium";
  if (value === "advanced") return "Hard";

  return difficulty || "Unknown";
};

const getDifficultyColor = (difficulty) => {
  switch (normalizeDifficulty(difficulty)) {
    case "Easy":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "Medium":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "Hard":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  }
};

const getProjectIcon = (project) => {
  const text = [
    project.title,
    project.description,
    ...(project.required_technologies || []),
  ]
    .join(" ")
    .toLowerCase();

  if (text.includes("ai") || text.includes("machine learning")) return "🧠";
  if (text.includes("mobile") || text.includes("react native")) return "📱";
  if (text.includes("security") || text.includes("blockchain")) return "🔐";
  if (text.includes("education") || text.includes("study")) return "📚";
  if (text.includes("health")) return "💙";

  return "🚀";
};

export default function AiSuggestions() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [existingProject, setExistingProject] = useState(null);

  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedProjects, setSavedProjects] = useState([]);
  const [likedProjects, setLikedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isLeader =
    Boolean(currentUser) &&
    Boolean(activeTeam) &&
    currentUser.id === activeTeam.leader_id;

  const clearMessages = () => {
    setMessage("");
    setErrorMessage("");
  };

  const loadTeamRecommendations = async (team) => {
    if (!team) return;

    clearMessages();

    try {
      const [recommendationData, projectData] = await Promise.all([
        getProjectRecommendations(team.id),
        getTeamProject(team.id).catch((error) => {
          const errorText = error.message?.toLowerCase() || "";
          if (errorText.includes("project not found")) return null;
          throw error;
        }),
      ]);

      setRecommendations(recommendationData || []);
      setExistingProject(projectData);
    } catch (error) {
      setRecommendations([]);
      setExistingProject(null);
      setErrorMessage(
        error.message || "Unable to load project recommendations."
      );
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoading(true);
        clearMessages();
      
        const userData = await getCurrentUser();
        setCurrentUser(userData);

        const teamData = await getUserTeams(userData.id);
        setTeams(teamData || []);

        const initialTeam = teamData?.[0] || null;
        setActiveTeam(initialTeam);

        if (initialTeam) {
          await loadTeamRecommendations(initialTeam);
        }
      } catch (error) {
        setErrorMessage(
          error.message ||
            "Unable to initialize project recommendations."
        );
      } finally {
        setIsLoading(false);
     }
    };

   initializePage();
  }, []);

  const formattedProjects = useMemo(() => {
    const sorted = [...recommendations].sort(
      (first, second) =>
        (second.confidence_score || 0) - (first.confidence_score || 0)
    );

    return sorted.map((project, index) => ({
      ...project,
      difficulty: normalizeDifficulty(project.difficulty_level),
      tech: project.required_technologies || [],
      match: Math.round((project.confidence_score || 0) * 100),
      isTopMatch: index === 0,
      icon: getProjectIcon(project),
    }));
  }, [recommendations]);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return formattedProjects.filter((project) => {
      if (activeTab === SAVED_TAB && !savedProjects.includes(project.id)) {
        return false;
      }

      if (filter === "easy" && project.difficulty !== "Easy") return false;
      if (filter === "medium" && project.difficulty !== "Medium") return false;
      if (filter === "topmatch" && !project.isTopMatch) return false;

      if (!normalizedSearch) return true;

      return [
        project.title,
        project.description,
        project.difficulty,
        ...project.tech,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [
    activeTab,
    filter,
    formattedProjects,
    savedProjects,
    searchQuery,
  ]);

  const averageMatch = useMemo(() => {
    if (formattedProjects.length === 0) return 0;

    return Math.round(
      formattedProjects.reduce(
        (total, project) => total + project.match,
        0
      ) / formattedProjects.length
    );
  }, [formattedProjects]);

  const recommendedTechnologies = useMemo(() => {
    const technologyCount = new Map();

    formattedProjects.forEach((project) => {
      project.tech.forEach((technology) => {
        technologyCount.set(
          technology,
          (technologyCount.get(technology) || 0) + 1
        );
      });
    });

    return [...technologyCount.entries()]
      .sort((first, second) => second[1] - first[1])
      .slice(0, 5)
      .map(([technology]) => technology);
  }, [formattedProjects]);

  const handleTeamChange = async (event) => {
    const selectedTeam = teams.find(
      (team) => team.id === event.target.value
    );

    setActiveTeam(selectedTeam || null);
    setSelectedProject(null);
    clearMessages();

    if (!selectedTeam) {
      setRecommendations([]);
      setExistingProject(null);
      return;
    }

    try {
      setIsLoading(true);
      await loadTeamRecommendations(selectedTeam);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!activeTeam) return;

    try {
      setIsGenerating(true);
      clearMessages();

      const generated = await generateProjectRecommendations(
        activeTeam.id,
        5
      );

      setRecommendations(generated || []);
      setMessage("Project recommendations generated successfully.");
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to generate project recommendations."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectProject = async (project) => {
    if (!activeTeam) return;

    if (existingProject) {
      setErrorMessage(
        `This team already has the project "${existingProject.title}".`
      );
      return;
    }

    try {
      setIsSelecting(true);
      clearMessages();

      const createdProject = await createProject({
        team_id: activeTeam.id,
        recommendation_id: project.id,
        title: project.title,
        description: project.description,
      });

      setExistingProject(createdProject);
      setSelectedProject(null);
      setMessage(`"${createdProject.title}" was selected successfully.`);
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to select this project."
      );
    } finally {
      setIsSelecting(false);
    }
  };

  const toggleSave = (id) => {
    setSavedProjects((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const toggleLike = (id) => {
    setLikedProjects((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const resetFilters = () => {
    setActiveTab(ALL_TAB);
    setSearchQuery("");
    setFilter("all");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!activeTeam) {
    return (
      <div className="mx-auto max-w-4xl rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-900">
        <Rocket className="mx-auto h-12 w-12 text-slate-300" />
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          No team available
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Create or join a team before requesting project recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            <Sparkles className="h-7 w-7 text-indigo-600" />
            Project Discovery
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            AI-powered project recommendations for your team
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {teams.length > 1 && (
            <select
              value={activeTeam.id}
              onChange={handleTeamChange}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.team_name}
                </option>
              ))}
            </select>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 sm:w-56"
            />
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {errorMessage}
        </div>
      )}

      <div className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white shadow-xl shadow-indigo-500/20 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
              <Rocket className="h-6 w-6" />
              Ready to build, {activeTeam.team_name}?
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-indigo-100">
              {formattedProjects.length > 0
                ? `We found ${formattedProjects.length} ideas based on your team's combined skills, interests, and experience.`
                : "Generate personalized project ideas using your team's combined skills, interests, and experience."}
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-indigo-200">
                  AI-Powered
                </p>
                <p className="flex items-center gap-1 font-bold">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  Recommendations
                </p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-indigo-200">
                  Avg. Match
                </p>
                <p className="text-lg font-bold">{averageMatch}%</p>
              </div>
            </div>

            {isLeader && (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {formattedProjects.length > 0
                  ? "Regenerate Ideas"
                  : "Generate Ideas"}
              </button>
            )}
          </div>
        </div>
      </div>

      {existingProject && (
        <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
          <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
            Selected project: {existingProject.title}
          </p>
          <button
            type="button"
            onClick={() => navigate("/my-projects")}
            className="mt-2 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Open My Projects
          </button>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredProjects.length} of {formattedProjects.length} projects
        </p>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Clear search
          </button>
        )}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {[
            ["All Suggestions", ALL_TAB],
            ["Saved Ideas", SAVED_TAB],
          ].map(([label, key]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                activeTab === key
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              {label}
              {key === SAVED_TAB && savedProjects.length > 0 && (
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {savedProjects.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["All", "all"],
            ["Easy", "easy"],
            ["Medium", "medium"],
            ["Top Match", "topmatch"],
          ].map(([label, key]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === key
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {formattedProjects.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
          <Sparkles className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="mt-3 text-lg font-bold text-slate-700 dark:text-slate-300">
            No project recommendations yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isLeader
              ? "Generate project ideas for your team."
              : "The team leader has not generated recommendations yet."}
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <Search className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-lg font-bold text-slate-700 dark:text-slate-300">
            No projects found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your filters or search terms.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredProjects.map((project) => {
            const isSaved = savedProjects.includes(project.id);
            const isLiked = likedProjects.includes(project.id);

            return (
              <article
                key={project.id}
                className={`rounded-2xl border bg-white p-6 transition hover:shadow-lg dark:bg-slate-900 ${
                  project.isTopMatch
                    ? "border-indigo-300 shadow-md shadow-indigo-100/50 dark:border-indigo-700 dark:shadow-indigo-900/20"
                    : "border-slate-200 hover:border-indigo-200 dark:border-slate-800 dark:hover:border-indigo-800"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="text-2xl">{project.icon}</span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="mt-1 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {project.isTopMatch && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      ⭐ Top Match
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium ${getDifficultyColor(
                      project.difficulty
                    )}`}
                  >
                    {project.difficulty}
                  </span>

                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Zap className="h-3.5 w-3.5" />
                    {project.match}% match
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tech.length > 0 ? (
                    project.tech.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      >
                        {technology}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">
                      No technologies specified
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleSave(project.id)}
                      aria-label={isSaved ? "Remove saved project" : "Save project"}
                      className={`rounded-lg p-1.5 transition ${
                        isSaved
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                          : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Bookmark
                        className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleLike(project.id)}
                      aria-label={isLiked ? "Remove like" : "Like project"}
                      className={`rounded-lg p-1.5 transition ${
                        isLiked
                          ? "bg-rose-50 text-rose-500 dark:bg-rose-950/30"
                          : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <ThumbsUp
                        className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {recommendedTechnologies.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Target className="h-5 w-5 text-indigo-600" />
              Recommended Technologies
            </h3>

            <div className="flex flex-wrap gap-2">
              {recommendedTechnologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Lightbulb className="h-5 w-5 text-indigo-600" />
              AI Insight
            </h3>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              The first recommendation has the highest confidence score for
              your team. Review its scope and technologies before selecting it.
            </p>
          </div>
        </div>
      )}

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-slate-950/80"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedProject.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedProject.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedProject.difficulty} • {selectedProject.match}% match
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="rounded-lg p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close project details"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {selectedProject.description}
            </p>

            <div className="mt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Required Technologies
              </p>

              <div className="flex flex-wrap gap-1.5">
                {selectedProject.tech.length > 0 ? (
                  selectedProject.tech.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {technology}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">
                    No technologies specified
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => toggleSave(selectedProject.id)}
                className={`flex-1 rounded-xl py-2.5 font-medium transition ${
                  savedProjects.includes(selectedProject.id)
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {savedProjects.includes(selectedProject.id)
                  ? "Saved ✓"
                  : "Save Idea"}
              </button>

              {isLeader ? (
                <button
                  type="button"
                  onClick={() => handleSelectProject(selectedProject)}
                  disabled={isSelecting || Boolean(existingProject)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSelecting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {existingProject
                    ? "Project Already Selected"
                    : "Select Project"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="flex-1 rounded-xl bg-slate-100 py-2.5 font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}