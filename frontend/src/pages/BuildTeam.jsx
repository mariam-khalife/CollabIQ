import React, { useState } from "react";
import {
  Search,
  HelpCircle,
  Bell,
  Sliders,
  Sparkles,
  Award,
  CheckCircle2,
  X,
  ArrowRight,
  Users,
  Target,
  Lightbulb,
  Loader2,
  Plus,
  ChevronRight,
  Zap,
  Brain,
} from "lucide-react";

const BuildTeam = () => {
  // Form State
  const [formData, setFormData] = useState({
    teamName: "",
    teamDescription: "",
    category: "",
    teamSize: 4,
    requiredSkills: ["Python", "UI/UX Design", "Statistics"],
  });

  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim().replace(/,/g, "");
      if (!formData.requiredSkills.includes(newSkill)) {
        setFormData((prev) => ({
          ...prev,
          requiredSkills: [...prev.requiredSkills, newSkill],
        }));
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    console.log("Saving draft:", formData);
    // API Call: API.post('/teams/draft', formData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSavingDraft(false);
    
    // Show success message
    alert("Draft saved successfully!");
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Creating team:", formData);
    // API Call: API.post('/teams', formData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    // Show success and redirect
    alert("Team created successfully!");
  };

  const getCategoryOptions = () => {
    return [
      { value: "", label: "Select Category" },
      { value: "ai", label: "🤖 Artificial Intelligence" },
      { value: "data", label: "📊 Data Science & ML" },
      { value: "quantum", label: "⚛️ Quantum Computing" },
      { value: "bio", label: "🧬 Bioinformatics" },
      { value: "robotics", label: "🤖 Robotics" },
      { value: "cybersecurity", label: "🔒 Cybersecurity" },
      { value: "web3", label: "🌐 Web3 & Blockchain" },
      { value: "other", label: "🔬 Other" },
    ];
  };

  return (
    <div className="flex-1 bg-slate-50/50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header Navbar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Build New Team
          </h1>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <span className="inline-block w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-300 dark:text-slate-600">2</span>
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/70 dark:bg-slate-800/70 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </button>

          <button className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              JD
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              John D.
            </span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Form Card */}
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleCreateTeam} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-6">
              {/* Form Title */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    General Information
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    Define the core identity of your collaborative group.
                  </p>
                </div>
              </div>

              {/* Team Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Team Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  required
                  placeholder="e.g. Quantum Computing Cohort 2024"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all"
                />
              </div>

              {/* Team Description */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Team Description
                </label>
                <textarea
                  name="teamDescription"
                  rows={4}
                  placeholder="Briefly describe the goals, mission, and focus of this team..."
                  value={formData.teamDescription}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all resize-none"
                />
              </div>

              {/* Project Category & Team Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Project Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all cursor-pointer"
                  >
                    {getCategoryOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Team Size Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Team Size
                    </label>
                    <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                      {formData.teamSize} members
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    value={formData.teamSize}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        teamSize: parseInt(e.target.value),
                      }))
                    }
                    className="w-full accent-indigo-600 bg-slate-100 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${((formData.teamSize - 2) / 13) * 100}%, #e2e8f0 ${((formData.teamSize - 2) / 13) * 100}%, #e2e8f0 100%)`
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold px-0.5">
                    <span>2</span>
                    <span>5</span>
                    <span>10</span>
                    <span>15</span>
                  </div>
                </div>
              </div>

              {/* Required Skills Tag Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Required Skills <span className="text-rose-500">*</span>
                </label>
                <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-wrap items-center gap-2 min-h-[50px] transition-all focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                  {formData.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-indigo-200 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={formData.requiredSkills.length === 0 ? "Add skills (press Enter or comma)" : "Add more..."}
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="flex-1 bg-transparent text-sm font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none min-w-[120px] px-2"
                  />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold">,</kbd> to add a skill
                </p>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/50 hover:bg-slate-50 dark:hover:bg-slate-700 text-indigo-950 dark:text-slate-300 text-sm font-extrabold rounded-xl transition-all cursor-pointer shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingDraft ? (
                    <>
                      <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Draft"
                  )}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.98] text-white text-sm font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Team
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Insights Widget */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl p-6 text-white space-y-6 shadow-xl shadow-indigo-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-indigo-200 text-[10px] font-black tracking-widest uppercase">
                  <Brain className="w-4 h-4" />
                  <span>AI Insights</span>
                </div>

                <div className="mt-4">
                  <h3 className="text-xl font-extrabold leading-tight">
                    Perfect Match Potential
                  </h3>
                  <p className="text-sm text-indigo-100/90 mt-2 leading-relaxed">
                    Based on your selected skills and category, we've identified
                    <span className="block text-2xl font-black text-white mt-1">42 candidates</span>
                    who would excel in this team.
                  </p>
                </div>

                {/* Top Recommended Skill */}
                <div className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block mb-2">
                    <Zap className="w-3 h-3 inline mr-1" />
                    Top Recommended Skill
                  </span>
                  <div className="flex items-center gap-2 text-sm font-extrabold">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Scientific Writing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Setup Tips */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-white">
                  Team Setup Tips
                </h4>
              </div>

              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    Clear names attract more relevant collaborators.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    Don't over-specify skills; leave room for diverse talents.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    Team sizes between 4-6 often show the highest productivity.
                  </p>
                </li>
              </ul>
            </div>

            {/* Motivational Visual Quote Card */}
            <div className="rounded-3xl overflow-hidden relative border border-slate-200/60 dark:border-slate-800 shadow-sm group">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Team Collaboration"
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-5">
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
                  <p className="text-white text-xs font-medium italic leading-relaxed">
                    "Alone we can do so little; together we can do so much."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuildTeam;