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
              : data.skills.split(",").map((s) => s.trim())
          );
        }

        if (data.interests) {
          setInterests(
            Array.isArray(data.interests)
              ? data.interests
              : data.interests.split(",").map((i) => i.trim())
          );
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage({ type: "error", text: "Failed to load profile details." });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
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

      setMessage({ type: "success", text: "Profile updated successfully!" });
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50/50 p-4 text-slate-800 font-sans sm:p-6 lg:p-8">
      <main className="mx-auto max-w-4xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl tracking-tight">
              My Profile
            </h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              Manage your academic identity, skills, and project preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>

        {/* Success/Error Alert */}
        {message.text && (
          <div
            className={`flex items-center gap-3 rounded-xl p-4 text-xs font-semibold ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          {/* General Information Section */}
          <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700">
                  <User className="h-3.5 w-3.5 text-slate-400" /> Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleProfileChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-400" /> University / Institution
                </label>
                <input
                  type="text"
                  name="university"
                  value={profile.university}
                  onChange={handleProfileChange}
                  placeholder="e.g. Stanford University"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-slate-400" /> Availability
                </label>
                <select
                  name="availability"
                  value={profile.availability}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                >
                  <option value="Flexible">Flexible</option>
                  <option value="Part-time (10-15 hrs/wk)">Part-time (10-15 hrs/wk)</option>
                  <option value="Full-time (20+ hrs/wk)">Full-time (20+ hrs/wk)</option>
                  <option value="Weekends Only">Weekends Only</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Award className="h-3.5 w-3.5 text-slate-400" /> Experience Level
                </label>
                <select
                  name="experience_level"
                  value={profile.experience_level}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Bio / Background
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={profile.bio}
                  onChange={handleProfileChange}
                  placeholder="Describe your background, skills, and goals..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
                <Star className="h-4 w-4" />
                <span>Skills</span>
              </div>

              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
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
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />

                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  Add Skill
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    onClick={() => handleDeleteSkill(skill)}
                    className="cursor-pointer rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                    title="Click to remove"
                  >
                    {skill} &times;
                  </span>
                ))}
                {skills.length === 0 && (
                  <p className="text-xs italic text-slate-400">No skills added yet.</p>
                )}
              </div>
            </div>
          </section>

          {/* Research Interests Section */}
          <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
                <BookOpen className="h-4 w-4" />
                <span>Research & Academic Interests</span>
              </div>

              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
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
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />

                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  Add Interest
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    onClick={() => handleDeleteInterest(interest)}
                    className="cursor-pointer rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                    title="Click to remove"
                  >
                    {interest} &times;
                  </span>
                ))}
                {interests.length === 0 && (
                  <p className="text-xs italic text-slate-400">No interests added yet.</p>
                )}
              </div>
            </div>
          </section>

        </form>
      </main>
    </div>
  );
}