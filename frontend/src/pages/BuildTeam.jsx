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

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
    // API Call: API.post('/teams/draft', formData)
  };

  const handleCreateTeam = (e) => {
    e.preventDefault();
    console.log("Creating team:", formData);
    // API Call: API.post('/teams', formData)
  };

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen">
      {/* Top Header Navbar */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-extrabold text-indigo-950 tracking-tight">
            Build New Team
          </h1>
          <span className="text-xs font-semibold text-slate-400">
            / Step 1 of 2
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/70 border border-transparent rounded-full text-xs focus:outline-none focus:bg-white focus:border-indigo-600 transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <button className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          <button className="relative text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Card (Column 8) */}
          <div className="lg:col-span-8 space-y-6">
            <form
              onSubmit={handleCreateTeam}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6"
            >
              {/* Form Title */}
              <div className="flex items-center gap-4 pb-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-indigo-950">
                    General Information
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Define the core identity of your collaborative group.
                  </p>
                </div>
              </div>

              {/* Team Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Team Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  required
                  placeholder="e.g. Quantum Computing Cohort 2024"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>

              {/* Team Description */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Team Description
                </label>
                <textarea
                  name="teamDescription"
                  rows={4}
                  placeholder="Briefly describe the goals, mission, and focus of this team..."
                  value={formData.teamDescription}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Project Category & Team Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Project Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option value="ai">Artificial Intelligence</option>
                    <option value="data">Data Science & ML</option>
                    <option value="quantum">Quantum Computing</option>
                    <option value="bio">Bioinformatics</option>
                  </select>
                </div>

                {/* Team Size Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">
                      Team Size
                    </label>
                    <span className="text-xs font-extrabold text-indigo-600">
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
                    className="w-full accent-indigo-600 bg-slate-100 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                    <span>2</span>
                    <span>5</span>
                    <span>10</span>
                    <span>15</span>
                  </div>
                </div>
              </div>

              {/* Required Skills Tag Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Required Skills
                </label>
                <div className="p-2.5 bg-indigo-50/40 border border-slate-200 rounded-xl flex flex-wrap items-center gap-2 min-h-[50px]">
                  {formData.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-2xs"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-indigo-200 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add more..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="flex-1 bg-transparent text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none min-w-[120px] px-2"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Press Enter or comma to add a skill.
                </p>
              </div>
            </form>

            {/* Bottom Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-6 py-3 bg-white border border-indigo-200 hover:bg-slate-50 text-indigo-950 text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={handleCreateTeam}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                Create Team
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Cards Sidebar (Column 4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Insights Widget */}
            <div className="bg-indigo-600 rounded-3xl p-6 text-white space-y-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 text-indigo-200 text-[10px] font-black tracking-widest uppercase">
                <Sparkles className="w-4 h-4" />
                <span>AI Insights</span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold leading-tight">
                  Perfect Match Potential
                </h3>
                <p className="text-xs text-indigo-100/90 mt-2 leading-relaxed">
                  Based on your selected skills and category, we've identified
                  42 candidates who would excel in this team.
                </p>
              </div>

              {/* Top Recommended Skill Pill */}
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block mb-2">
                  Top Recommended Skill
                </span>
                <div className="flex items-center gap-2 text-xs font-extrabold">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Scientific Writing</span>
                </div>
              </div>
            </div>

            {/* Team Setup Tips */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800">
                Team Setup Tips
              </h4>

              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 leading-snug">
                    Clear names attract more relevant collaborators.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 leading-snug">
                    Don't over-specify skills; leave room for diverse talents.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 leading-snug">
                    Team sizes between 4-6 often show the highest productivity.
                  </p>
                </li>
              </ul>
            </div>

            {/* Motivational Visual Quote Card */}
            <div className="rounded-3xl overflow-hidden relative border border-slate-100 shadow-xs group">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Team Collaboration"
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-5">
                <p className="text-white text-xs font-medium italic leading-relaxed">
                  "Alone we can do so little; together we can do so much."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuildTeam;