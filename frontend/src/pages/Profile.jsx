import React, { useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  MapPin,
  Award,
  Star,
  Edit2,
  Save,
  X,
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Link as LinkIcon,
  Twitter,
  Github,
  Linkedin,
  Globe,
  PenTool,
  Upload,
  Camera,
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Dr. Sarah Chen",
    title: "Lead AI Researcher",
    department: "Computer Science Department",
    university: "Stanford University",
    location: "Stanford, CA",
    email: "sarah.chen@stanford.edu",
    bio: "Passionate about artificial intelligence, machine learning, and collaborative research. Leading interdisciplinary projects at the intersection of AI and healthcare.",
    researchInterests: ["Machine Learning", "NLP", "Computer Vision", "Healthcare AI"],
    publications: 24,
    citations: 847,
    hIndex: 18,
    teams: 5,
    projects: 12,
    reputation: 2840,
    tier: "Elite Researcher",
    social: {
      twitter: "@sarahchen_ai",
      github: "sarahchen",
      linkedin: "sarahchen-ai",
      website: "sarahchen.ai",
    },
    skills: ["Python", "TensorFlow", "PyTorch", "R", "SQL", "Docker", "AWS", "React"],
    education: [
      {
        degree: "Ph.D. in Computer Science",
        institution: "Stanford University",
        year: "2020",
      },
      {
        degree: "M.S. in AI",
        institution: "MIT",
        year: "2016",
      },
    ],
    recentProjects: [
      { name: "AI-Driven Drug Discovery", status: "Active", progress: 75 },
      { name: "Neural Pattern Recognition", status: "Review", progress: 95 },
      { name: "Healthcare Analytics Platform", status: "Planning", progress: 30 },
    ],
  });

  const [editForm, setEditForm] = useState(profileData);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setProfileData(editForm);
      setIsEditing(false);
    } else {
      setEditForm(profileData);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditForm(profileData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, value) => {
    const items = value.split(",").map((item) => item.trim()).filter(Boolean);
    setEditForm((prev) => ({ ...prev, [field]: items }));
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Review":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "Planning":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "Elite Researcher":
        return "from-amber-500 to-orange-500";
      case "Lead Researcher":
        return "from-indigo-500 to-purple-500";
      case "Senior Researcher":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-emerald-500 to-teal-500";
    }
  };

  return (
    <div className="flex-1 bg-slate-50/50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Profile Overview
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your academic identity and team matching preferences.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Card - Takes 8 columns on large screens */}
          <div className="lg:col-span-8 space-y-6">
            {/* Basic Profile Info */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-500/30">
                      {getInitials(isEditing ? editForm.name : profileData.name)}
                    </div>
                    <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                      <Camera className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="text"
                          name="university"
                          value={editForm.university}
                          onChange={handleChange}
                          className="flex-1 min-w-[120px] px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="University"
                        />
                        <input
                          type="text"
                          name="location"
                          value={editForm.location}
                          onChange={handleChange}
                          className="flex-1 min-w-[120px] px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Location"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                        {profileData.name}
                      </h2>
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                        {profileData.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" />
                          {profileData.university}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {profileData.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-4 h-4" />
                          {profileData.email}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Bio
                </h3>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {profileData.bio}
                  </p>
                )}
              </div>

              {/* Research Interests */}
              <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  Research Interests
                </h3>
                {isEditing ? (
                  <textarea
                    name="researchInterests"
                    value={editForm.researchInterests.join(", ")}
                    onChange={(e) => handleArrayChange("researchInterests", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Machine Learning, NLP, Computer Vision"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.researchInterests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-lg border border-indigo-100 dark:border-indigo-800/50"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                Skills & Expertise
              </h3>
              {isEditing ? (
                <textarea
                  name="skills"
                  value={editForm.skills.join(", ")}
                  onChange={(e) => handleArrayChange("skills", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Python, TensorFlow, PyTorch, R, SQL, Docker"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Education Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                Education
              </h3>
              <div className="space-y-4">
                {profileData.education.map((edu, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
                      <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {edu.degree}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {edu.institution} • {edu.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Recent Projects
                </h3>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {profileData.projects} Total
                </span>
              </div>
              <div className="space-y-3">
                {profileData.recentProjects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {project.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {project.progress}% complete
                        </span>
                      </div>
                    </div>
                    <div className="w-16 ml-2">
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Reputation & Stats - Takes 4 columns on large screens */}
          <div className="lg:col-span-4 space-y-6">
            {/* Reputation Card */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                    {profileData.tier}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">
                    {profileData.reputation}
                  </span>
                  <span className="text-sm text-indigo-200">points</span>
                </div>

                <div className="flex items-center gap-1.5 mt-1 text-emerald-400 text-sm font-bold">
                  <TrendingUp className="w-4 h-4" />
                  +142 this month
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-xs text-indigo-200 font-medium">Publications</p>
                    <p className="text-xl font-bold">{profileData.publications}</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 font-medium">Citations</p>
                    <p className="text-xl font-bold">{profileData.citations.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 font-medium">H-Index</p>
                    <p className="text-xl font-bold">{profileData.hIndex}</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 font-medium">Teams</p>
                    <p className="text-xl font-bold">{profileData.teams}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 shadow-sm text-center">
                <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {profileData.teams}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Teams</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 shadow-sm text-center">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {profileData.publications}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Papers</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 shadow-sm text-center">
                <Star className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {profileData.reputation}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Reputation</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 shadow-sm text-center">
                <Calendar className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {profileData.projects}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Projects</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                Connect
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <Twitter className="w-4 h-4 text-sky-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {profileData.social.twitter}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {profileData.social.github}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {profileData.social.linkedin}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {profileData.social.website}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;