import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Mail,
  GraduationCap,
  Clock,
  Award,
  Star,
  BookOpen,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Briefcase,
  MapPin,
  Loader2,
  X,
  Plus,
  PenTool,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function getStoredToken() {
  return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
}

export default function MyProfile() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    university: "",
    bio: "",
    availability: "Flexible",
    experience_level: "Intermediate",
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getStoredToken();
      if (!token) {
        setMessage({ type: "error", text: "You are not logged in." });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setProfile({
          full_name: data.full_name || "",
          email: data.email || "",
          university: data.university || "",
          bio: data.bio || "",
          availability: data.availability || "Flexible",
          experience_level: data.experience_level || "Intermediate",
        });

        if (data.skills) {
          setSkills(
            Array.isArray(data.skills)
              ? data.skills
              : data.skills.split(",").map((s) => s.trim()).filter(Boolean)
          );
        }

        if (data.interests) {
          setInterests(
            Array.isArray(data.interests)
              ? data.interests
              : data.interests.split(",").map((i) => i.trim()).filter(Boolean)
          );
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage({ 
          type: "error", 
          text: error.response?.data?.detail || "Failed to load profile details." 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleAddInterest = () => {
    const trimmed = newInterest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests((prev) => [...prev, trimmed]);
      setNewInterest("");
    }
  };

  const handleDeleteInterest = (interestToRemove) => {
    setInterests((prev) => prev.filter((interest) => interest !== interestToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const token = getStoredToken();
    if (!token) {
      setMessage({ type: "error", text: "You are not logged in." });
      setSaving(false);
      return;
    }

    try {
      await axios.put(
        `${API_URL}/users/me`,
        {
          ...profile,
          skills: skills.join(", "),
          interests: interests.join(", "),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({ type: "success", text: "Profile updated successfully! 🎉" });
      
      // Auto-dismiss success message after 4 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 4000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.detail || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getExperienceLevelBadge = (level) => {
    const colors = {
      Beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      Intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Advanced: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      Expert: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return colors[level] || colors.Intermediate;
  };

  const getAvailabilityBadge = (availability) => {
    const colors = {
      "Flexible": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      "Part-time (10-15 hrs/wk)": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      "Full-time (20+ hrs/wk)": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      "Weekends Only": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    };
    return colors[availability] || colors["Flexible"];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50/50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                My Profile
              </h1>
              <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-100 dark:border-indigo-800/50 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Academic
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your academic identity, skills, and project preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Profile
              </>
            )}
          </button>
        </div>

        {/* Success/Error Alert */}
        {message.text && (
          <div
            className={`flex items-start gap-3 rounded-2xl p-4 text-sm font-semibold animate-fade-in ${
              message.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          {/* Profile Header Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/30">
                {getInitials(profile.full_name)}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {profile.full_name || "Your Name"}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getExperienceLevelBadge(profile.experience_level)}`}>
                    {profile.experience_level}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getAvailabilityBadge(profile.availability)}`}>
                    {profile.availability}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                  {profile.email}
                </p>
              </div>
            </div>
          </div>

          {/* General Information Section */}
          <section className="space-y-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
                <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <User className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" /> 
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleProfileChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" /> 
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  disabled
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30 px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" /> 
                  University / Institution
                </label>
                <input
                  type="text"
                  name="university"
                  value={profile.university}
                  onChange={handleProfileChange}
                  placeholder="e.g. Stanford University"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" /> 
                  Availability
                </label>
                <select
                  name="availability"
                  value={profile.availability}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all text-slate-700 dark:text-slate-200"
                >
                  <option value="Flexible">🔄 Flexible</option>
                  <option value="Part-time (10-15 hrs/wk)">⏳ Part-time (10-15 hrs/wk)</option>
                  <option value="Full-time (20+ hrs/wk)">💪 Full-time (20+ hrs/wk)</option>
                  <option value="Weekends Only">📅 Weekends Only</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Award className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" /> 
                  Experience Level
                </label>
                <select
                  name="experience_level"
                  value={profile.experience_level}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all text-slate-700 dark:text-slate-200"
                >
                  <option value="Beginner">🌱 Beginner</option>
                  <option value="Intermediate">📈 Intermediate</option>
                  <option value="Advanced">🚀 Advanced</option>
                  <option value="Expert">🏆 Expert</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <PenTool className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" /> 
                  Bio / Background
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={profile.bio}
                  onChange={handleProfileChange}
                  placeholder="Describe your background, skills, and goals..."
                  className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="space-y-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
                <Star className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Skills & Expertise
              </h2>
              <span className="ml-auto text-xs font-medium text-slate-400 dark:text-slate-500">
                {skills.length} skills
              </span>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(event) => setNewSkill(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add a skill (e.g. React, Python)"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSkill}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 px-5 py-2.5 text-sm font-bold text-white transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  onClick={() => handleDeleteSkill(skill)}
                  className="group cursor-pointer rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-3.5 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 hover:text-rose-700 dark:hover:text-rose-400 transition-all border border-indigo-100 dark:border-indigo-800/50 hover:border-rose-200 dark:hover:border-rose-800/50 flex items-center gap-1.5"
                  title="Click to remove"
                >
                  {skill}
                  <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </span>
              ))}
              {skills.length === 0 && (
                <p className="text-sm italic text-slate-400 dark:text-slate-500">
                  No skills added yet. Add your first skill above!
                </p>
              )}
            </div>
          </section>

          {/* Research Interests Section */}
          <section className="space-y-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
                <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Research & Academic Interests
              </h2>
              <span className="ml-auto text-xs font-medium text-slate-400 dark:text-slate-500">
                {interests.length} interests
              </span>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(event) => setNewInterest(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  placeholder="Add an interest (e.g. Machine Learning, NLP)"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddInterest}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 px-5 py-2.5 text-sm font-bold text-white transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                Add Interest
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  onClick={() => handleDeleteInterest(interest)}
                  className="group cursor-pointer rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3.5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 hover:text-rose-700 dark:hover:text-rose-400 transition-all border border-emerald-100 dark:border-emerald-800/50 hover:border-rose-200 dark:hover:border-rose-800/50 flex items-center gap-1.5"
                  title="Click to remove"
                >
                  {interest}
                  <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </span>
              ))}
              {interests.length === 0 && (
                <p className="text-sm italic text-slate-400 dark:text-slate-500">
                  No interests added yet. Add your first interest above!
                </p>
              )}
            </div>
          </section>

          {/* Save Button Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Your profile information is visible to potential collaborators
            </p>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}