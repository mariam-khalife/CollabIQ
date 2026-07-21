import { useEffect, useState } from "react";
import axios from "axios";
import {
  Award,
  Briefcase,
  Clock3,
  Heart,
  Plus,
  Save,
  Star,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

function getStoredToken() {
  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")
  );
}

function MyProfile() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    university: "",
    bio: "",
    availability: "",
    experience_level: "",
  });

  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);

  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const token = getStoredToken();

      if (!token) {
        setIsLoading(false);
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

      const response = await axios.get(
          `${API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile response:", response.data);

      setProfileData({
        full_name: response.data.full_name || "",
        email: response.data.email || "",
        university: response.data.university || "",
        bio: response.data.bio || "",
        availability: response.data.availability || "",
        experience_level: response.data.experience_level || "",
      });
    } catch (error) {
      console.error("Profile loading error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        sessionStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      setErrorMessage(
        error.response?.data?.detail ||
          "Unable to load your profile."
      );
    } finally {
      setIsLoading(false);
    }
  };

  loadProfile();
}, [navigate]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileData((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();

    if (!trimmedSkill) {
      return;
    }

    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === trimmedSkill.toLowerCase()
    );

    if (alreadyExists) {
      setNewSkill("");
      return;
    }

    setSkills((previousSkills) => [
      ...previousSkills,
      trimmedSkill,
    ]);

    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((previousSkills) =>
      previousSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleAddInterest = () => {
    const trimmedInterest = newInterest.trim();

    if (!trimmedInterest) {
      return;
    }

    const alreadyExists = interests.some(
      (interest) =>
        interest.toLowerCase() === trimmedInterest.toLowerCase()
    );

    if (alreadyExists) {
      setNewInterest("");
      return;
    }

    setInterests((previousInterests) => [
      ...previousInterests,
      trimmedInterest,
    ]);

    setNewInterest("");
  };

  const handleRemoveInterest = (interestToRemove) => {
    setInterests((previousInterests) =>
      previousInterests.filter(
        (interest) => interest !== interestToRemove
      )
    );
  };

  const handleSaveChanges = async () => {
    const token = getStoredToken();

    if (!token) {
      navigate("/login");
      return;
    }
    
    if (!(profileData.full_name || "").trim()) {
      setErrorMessage("Full name is required.");
      return;
    }

    const updateData = {
      full_name: (profileData.full_name || "").trim(),
      university: (profileData.university || "").trim() || null,
      bio: (profileData.bio || "").trim() || null,
      availability: profileData.availability || null,
      experience_level: profileData.experience_level || null,
    };

    try {
      setIsSaving(true);
      setErrorMessage("");

      const response = await axios.put(
        `${API_URL}/users/me`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProfileData((previousProfile) => ({
        ...previousProfile,
        ...response.data,
      }));

      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        sessionStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      const detail = error.response?.data?.detail;

      setErrorMessage(
        typeof detail === "string"
          ? detail
          : "Unable to update your profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (!profileData.full_name) {
      return "U";
    }

    return profileData.full_name
      .split(" ")
      .map((namePart) => namePart.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Profile Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your academic identity and collaboration preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />

          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </section>

      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Main profile column */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="mx-auto flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-3xl font-bold text-indigo-700 md:mx-0">
                {getInitials()}
              </div>

              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    Full Name
                  </label>

                  <input
                    id="full_name"
                    type="text"
                    name="full_name"
                    value={profileData.full_name}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="university"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    University
                  </label>

                  <input
                    id="university"
                    type="text"
                    name="university"
                    value={profileData.university}
                    onChange={handleProfileChange}
                    placeholder="Enter your university"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="bio"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    Bio
                  </label>

                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    placeholder="Describe your background and goals"
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
                <Star className="h-4 w-4" />
                Skills
              </div>

              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(event) =>
                    setNewSkill(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add a skill"
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />

                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="flex items-center justify-center gap-1 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
                  >
                    {skill}

                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {skills.length === 0 && (
                  <p className="text-sm text-slate-400">
                    No skills added yet.
                  </p>
                )}
              </div>
            </div>

            {/* Interests */}
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
                <Heart className="h-4 w-4" />
                Interests
              </div>

              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(event) =>
                    setNewInterest(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  placeholder="Add an interest"
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />

                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="flex items-center justify-center gap-1 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    {interest}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveInterest(interest)
                      }
                      aria-label={`Remove ${interest}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {interests.length === 0 && (
                  <p className="text-sm text-slate-400">
                    No interests added yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <section className="rounded-2xl bg-indigo-700 p-6 text-white shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Reputation Score
              </p>

              <Award className="h-5 w-5" />
            </div>

            <p className="mt-4 text-5xl font-black">0</p>

            <p className="mt-2 text-xs text-indigo-100">
              Reputation information will appear after completing team projects.
            </p>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
              <Briefcase className="h-4 w-4" />
              Collaboration Preferences
            </div>

            <div>
              <label
                htmlFor="experience_level"
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Experience Level
              </label>

              <select
                id="experience_level"
                name="experience_level"
                value={profileData.experience_level}
                onChange={handleProfileChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
              >
                <option value="">Select experience level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="availability"
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Availability
              </label>

              <div className="relative">
                <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  id="availability"
                  name="availability"
                  value={profileData.availability}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="">Select availability</option>
                  <option value="1-5 hours/week">
                    1–5 hours per week
                  </option>
                  <option value="6-10 hours/week">
                    6–10 hours per week
                  </option>
                  <option value="11-20 hours/week">
                    11–20 hours per week
                  </option>
                  <option value="20+ hours/week">
                    More than 20 hours per week
                  </option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
                <User className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">
                  {profileData.full_name || "Current User"}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {profileData.email}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;