// src/pages/AiSuggestions.jsx
import React, { useState } from "react";
import {
  Search,
  Filter,
  Sparkles,
  Clock,
  Users,
  ChevronRight,
  Bookmark,
  ThumbsUp,
  Target,
  Lightbulb,
  Rocket,
  Layers,
  X,
  Zap,
  Code,
  Database,
  Cloud,
  Brain,
} from "lucide-react";

const AiSuggestions = () => {
  // State for filters
  const [activeTab, setActiveTab] = useState("all");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for interactions
  const [savedProjects, setSavedProjects] = useState([]);
  const [likedProjects, setLikedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // All projects data
  const allProjects = [
    {
      id: 1,
      title: "Decentralized Voting System",
      description: "A blockchain-based application for secure, transparent campus elections using Ethereum and React.",
      difficulty: "Medium",
      duration: "4-6 Weeks",
      tech: ["Ethereum", "React", "Solidity"],
      match: 94,
      isTopMatch: true,
      icon: "🔗",
      teamSize: "4-6",
      category: "Blockchain",
    },
    {
      id: 2,
      title: "Mental Health Chatbot",
      description: "An empathetic AI companion designed for student support using modern LLM APIs and a clean mobile UI.",
      difficulty: "Medium",
      duration: "6-8 Weeks",
      tech: ["Node.js", "OpenAI", "React Native"],
      match: 88,
      isTopMatch: false,
      icon: "🧠",
      teamSize: "3-5",
      category: "AI/ML",
    },
    {
      id: 3,
      title: "AI-Powered Research Assistant",
      description: "An intelligent research tool that helps students find and summarize academic papers.",
      difficulty: "Hard",
      duration: "8-10 Weeks",
      tech: ["Python", "TensorFlow", "NLP"],
      match: 82,
      isTopMatch: false,
      icon: "📚",
      teamSize: "4-6",
      category: "AI/ML",
    },
    {
      id: 4,
      title: "Smart Campus Navigation",
      description: "An AR-powered navigation app for large university campuses with real-time location tracking.",
      difficulty: "Medium",
      duration: "6-8 Weeks",
      tech: ["React Native", "AR", "Firebase"],
      match: 76,
      isTopMatch: false,
      icon: "📍",
      teamSize: "3-4",
      category: "Mobile",
    },
    {
      id: 5,
      title: "AI Study Planner",
      description: "An intelligent study planner that optimizes student schedules using machine learning algorithms.",
      difficulty: "Easy",
      duration: "3-5 Weeks",
      tech: ["Python", "React", "ML"],
      match: 70,
      isTopMatch: false,
      icon: "📅",
      teamSize: "2-3",
      category: "AI/ML",
    },
  ];

  // Get filtered projects
  const getFilteredProjects = () => {
    let filtered = allProjects;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Difficulty filter
    if (filter === "easy") {
      filtered = filtered.filter((p) => p.difficulty === "Easy");
    } else if (filter === "medium") {
      filtered = filtered.filter((p) => p.difficulty === "Medium");
    } else if (filter === "topmatch") {
      filtered = filtered.filter((p) => p.isTopMatch);
    }

    // Tab filter
    if (activeTab === "savedideas") {
      filtered = filtered.filter((p) => savedProjects.includes(p.id));
    }

    return filtered;
  };

  const filteredProjects = getFilteredProjects();

  // Handlers
  const toggleSave = (id) => {
    setSavedProjects((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleLike = (id) => {
    setLikedProjects((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-indigo-600" />
            Project Discovery
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            AI-powered project recommendations for your team
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-xl shadow-indigo-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Rocket className="w-6 h-6" />
              Ready to build, Team Alpha?
            </h2>
            <p className="text-indigo-100 text-sm mt-1 max-w-2xl">
              Based on your team's collective skills in React, Python, and UI/UX Design,
              we've curated{" "}
              <span className="font-bold text-white">{allProjects.length} projects</span>{" "}
              that match your expertise.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10 shrink-0">
            <div className="text-center">
              <p className="text-[10px] text-indigo-200 uppercase tracking-wider">AI-Powered</p>
              <p className="font-bold flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Recommendations
              </p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-[10px] text-indigo-200 uppercase tracking-wider">Skill Match</p>
              <p className="font-bold text-lg">94%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredProjects.length} of {allProjects.length} projects
        </p>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {["All Suggestions", "Saved Ideas"].map((tab) => {
            const tabKey = tab.toLowerCase().replace(" ", "");
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tabKey)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tabKey
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tab}
                {tabKey === "savedideas" && savedProjects.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 text-white rounded-full text-xs">
                    {savedProjects.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Easy", "Medium", "Top Match"].map((tab) => {
            const tabKey = tab.toLowerCase().replace(" ", "");
            return (
              <button
                key={tab}
                onClick={() => setFilter(tabKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === tabKey
                    ? "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Project Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No projects found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === "savedideas" 
              ? "You haven't saved any projects yet." 
              : "Try adjusting your filters or search terms."}
          </p>
          {(activeTab === "savedideas" || searchQuery || filter !== "all") && (
            <button
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
                setFilter("all");
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const isSaved = savedProjects.includes(project.id);
            const isLiked = likedProjects.includes(project.id);

            return (
              <div
                key={project.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-6 transition-all hover:shadow-lg ${
                  project.isTopMatch
                    ? "border-indigo-300 dark:border-indigo-700 shadow-md shadow-indigo-100/50 dark:shadow-indigo-900/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{project.icon}</span>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </div>
                  {project.isTopMatch && (
                    <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-full whitespace-nowrap">
                      ⭐ Top Match
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg ${getDifficultyColor(
                      project.difficulty
                    )}`}
                  >
                    {project.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {project.duration}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Users className="w-3.5 h-3.5" />
                    {project.teamSize} people
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Zap className="w-3.5 h-3.5" />
                    {project.match}% match
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSave(project.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSaved
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
                          : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? "fill-indigo-600" : ""}`} />
                    </button>
                    <button
                      onClick={() => toggleLike(project.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isLiked
                          ? "text-rose-500 bg-rose-50 dark:bg-rose-950/30"
                          : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
                    </button>
                    {isSaved && (
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                        Saved
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Team Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recommended Stack */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Recommended Stack for Team Alpha
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-indigo-500" /> React.js
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Team Expertise: High</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "95%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-amber-500" /> PostgreSQL
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">Team Expertise: Mid</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Cloud className="w-4 h-4 text-blue-500" /> AWS Amplify
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">Learning Opp: +12%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Skill Gap Analysis */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Skill Gap Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Frontend Dev</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">100%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Backend / DB</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">75%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">AI / ML Basics</span>
                <span className="text-rose-600 dark:text-rose-400 font-medium">40%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: "40%" }} />
              </div>
            </div>
          </div>

          {/* AI Tip */}
          <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                  AI Tip: Choose the <span className="font-bold">"Mental Health Chatbot"</span> to level up your AI integration skills!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedProject.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedProject.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedProject.category} • {selectedProject.difficulty}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedProject.description}
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 uppercase">Duration</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {selectedProject.duration}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 uppercase">Team Size</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {selectedProject.teamSize}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 uppercase">Match</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedProject.match}%
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  toggleSave(selectedProject.id);
                  setSelectedProject(null);
                }}
                className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${
                  savedProjects.includes(selectedProject.id)
                    ? "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {savedProjects.includes(selectedProject.id) ? "Saved ✓" : "Save Project"}
              </button>
              <button className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors">
                View Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiSuggestions;