import { useEffect, useState } from "react";
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

import { apiRequest, getAccessToken, removeAccessToken } from "../services/api";
import {
  addUserSkill,
  getSkillCatalog,
  getUserSkills,
  removeUserSkill,
} from "../services/skillService";
import {
  addUserInterest,
  getInterestCatalog,
  getUserInterests,
  removeUserInterest,
} from "../services/interestService";

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

  const [userId, setUserId] = useState(null);

  // Skills are { skill_id, name, proficiency_level }; interests are
  // { interest_id, name }. The "saved" copies mirror what the server has, so
  // saving can send only what actually changed.
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [savedSkills, setSavedSkills] = useState([]);
  const [savedInterests, setSavedInterests] = useState([]);

  const [skillCatalog, setSkillCatalog] = useState([]);
  const [interestCatalog, setInterestCatalog] = useState([]);

  const [newSkill, setNewSkill] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("intermediate");
  const [newInterest, setNewInterest] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const token = getAccessToken();

      if (!token) {
        setIsLoading(false);
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await apiRequest("/auth/me");

        setProfileData({
          full_name: response.full_name || "",
          email: response.email || "",
          university: response.university || "",
          bio: response.bio || "",
          availability: response.availability || "",
          experience_level: response.experience_level || "",
        });

        setUserId(response.id);

        const [
          catalogSkills,
          catalogInterests,
          currentSkills,
          currentInterests,
        ] = await Promise.all([
          getSkillCatalog(),
          getInterestCatalog(),
          getUserSkills(response.id),
          getUserInterests(response.id),
        ]);

        setSkillCatalog(catalogSkills);
        setInterestCatalog(catalogInterests);

        const loadedSkills = currentSkills.map((userSkill) => ({
          skill_id: userSkill.skill_id,
          name: userSkill.skill_name,
          proficiency_level: userSkill.proficiency_level,
        }));

        const loadedInterests = currentInterests.map(
          (userInterest) => ({
            interest_id: userInterest.interest_id,
            name: userInterest.interest_name,
          })
        );

        setSkills(loadedSkills);
        setSavedSkills(loadedSkills);
        setInterests(loadedInterests);
        setSavedInterests(loadedInterests);
      } catch (error) {
        console.error("Profile loading error:", error);

        if (error.status === 401) {
          removeAccessToken();
          navigate("/login");
          return;
        }

        setErrorMessage(error.message || "Unable to load your profile.");
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

  // Skills and interests are linked by id, so a typed name has to resolve to
  // a catalogue entry before it can be added.
  const findInCatalog = (catalog, name) =>
    catalog.find(
      (entry) =>
        entry.name.toLowerCase() === name.trim().toLowerCase()
    );

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();

    if (!trimmedSkill) {
      return;
    }

    const match = findInCatalog(skillCatalog, trimmedSkill);

    if (!match) {
      setErrorMessage(
        `"${trimmedSkill}" is not in the skill list. Pick one of the suggestions.`
      );
      return;
    }

    const alreadyExists = skills.some(
      (skill) => skill.skill_id === match.id
    );

    if (alreadyExists) {
      setNewSkill("");
      return;
    }

    setErrorMessage("");

    setSkills((previousSkills) => [
      ...previousSkills,
      {
        skill_id: match.id,
        name: match.name,
        proficiency_level: newSkillLevel,
      },
    ]);

    setNewSkill("");
  };

  const handleRemoveSkill = (skillId) => {
    setSkills((previousSkills) =>
      previousSkills.filter(
        (skill) => skill.skill_id !== skillId
      )
    );
  };

  const handleAddInterest = () => {
    const trimmedInterest = newInterest.trim();

    if (!trimmedInterest) {
      return;
    }

    const match = findInCatalog(
      interestCatalog,
      trimmedInterest
    );

    if (!match) {
      setErrorMessage(
        `"${trimmedInterest}" is not in the interest list. Pick one of the suggestions.`
      );
      return;
    }

    const alreadyExists = interests.some(
      (interest) => interest.interest_id === match.id
    );

    if (alreadyExists) {
      setNewInterest("");
      return;
    }

    setErrorMessage("");

    setInterests((previousInterests) => [
      ...previousInterests,
      { interest_id: match.id, name: match.name },
    ]);

    setNewInterest("");
  };

  const handleRemoveInterest = (interestId) => {
    setInterests((previousInterests) =>
      previousInterests.filter(
        (interest) => interest.interest_id !== interestId
      )
    );
  };

  const handleSaveChanges = async () => {
    const token = getAccessToken();

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
      university:
        (profileData.university || "").trim() || null,
      bio: (profileData.bio || "").trim() || null,
      availability: profileData.availability || null,
      experience_level:
        profileData.experience_level || null,
    };

    try {
      setIsSaving(true);
      setErrorMessage("");

      const response = await apiRequest("/users/me", {
        method: "PUT",
        body: updateData,
      });

      setProfileData((previousProfile) => ({
        ...previousProfile,
        ...response,
      }));

      // Skills and interests live on their own endpoints, so persist just
      // the difference against what the server already had.
      const addedSkills = skills.filter(
        (skill) =>
          !savedSkills.some(
            (saved) => saved.skill_id === skill.skill_id
          )
      );
      const removedSkills = savedSkills.filter(
        (saved) =>
          !skills.some(
            (skill) => skill.skill_id === saved.skill_id
          )
      );
      const addedInterests = interests.filter(
        (interest) =>
          !savedInterests.some(
            (saved) =>
              saved.interest_id === interest.interest_id
          )
      );
      const removedInterests = savedInterests.filter(
        (saved) =>
          !interests.some(
            (interest) =>
              interest.interest_id === saved.interest_id
          )
      );

      await Promise.all([
        ...addedSkills.map((skill) =>
          addUserSkill(
            userId,
            skill.skill_id,
            skill.proficiency_level
          )
        ),
        ...removedSkills.map((skill) =>
          removeUserSkill(userId, skill.skill_id)
        ),
        ...addedInterests.map((interest) =>
          addUserInterest(userId, interest.interest_id)
        ),
        ...removedInterests.map((interest) =>
          removeUserInterest(userId, interest.interest_id)
        ),
      ]);

      setSavedSkills(skills);
      setSavedInterests(interests);

      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      if (error.status === 401) {
        removeAccessToken();
        navigate("/login");
        return;
      }

      setErrorMessage(error.message || "Unable to update your profile.");
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
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Profile Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your academic identity and collaboration preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </section>

      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Main profile column */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="mx-auto flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-3xl font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 md:mx-0">
                {getInitials()}
              </div>

              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    Full Name
                  </label>

                  <input
                    id="full_name"
                    type="text"
                    name="full_name"
                    value={profileData.full_name}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-indigo-950"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="university"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
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
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="bio"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
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
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Skills and interests */}
          <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                <Star className="h-4 w-4" />
                Skills
              </div>

              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  list="skill-catalog"
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
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                />

                <datalist id="skill-catalog">
                  {skillCatalog
                    .filter(
                      (entry) =>
                        !skills.some(
                          (skill) =>
                            skill.skill_id === entry.id
                        )
                    )
                    .map((entry) => (
                      <option
                        key={entry.id}
                        value={entry.name}
                      />
                    ))}
                </datalist>

                <select
                  value={newSkillLevel}
                  onChange={(event) =>
                    setNewSkillLevel(event.target.value)
                  }
                  aria-label="Proficiency level"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">
                    Intermediate
                  </option>
                  <option value="advanced">Advanced</option>
                </select>

                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="flex items-center justify-center gap-1 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.skill_id}
                    className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                  >
                    {skill.name}

                    <span className="font-normal text-indigo-500 dark:text-indigo-400">
                      {skill.proficiency_level}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveSkill(skill.skill_id)
                      }
                      aria-label={`Remove ${skill.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {skills.length === 0 && (
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    No skills added yet.
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                <Heart className="h-4 w-4" />
                Interests
              </div>

              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  list="interest-catalog"
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
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                />

                <datalist id="interest-catalog">
                  {interestCatalog
                    .filter(
                      (entry) =>
                        !interests.some(
                          (interest) =>
                            interest.interest_id === entry.id
                        )
                    )
                    .map((entry) => (
                      <option
                        key={entry.id}
                        value={entry.name}
                      />
                    ))}
                </datalist>

                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="flex items-center justify-center gap-1 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest.interest_id}
                    className="flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white dark:bg-indigo-500"
                  >
                    {interest.name}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveInterest(
                          interest.interest_id
                        )
                      }
                      aria-label={`Remove ${interest.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {interests.length === 0 && (
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    No interests added yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <section className="rounded-2xl bg-indigo-700 p-6 text-white shadow-md dark:bg-indigo-600">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Reputation Score
              </p>

              <Award className="h-5 w-5" />
            </div>

            <p className="mt-4 text-5xl font-black">0</p>

            <p className="mt-2 text-xs text-indigo-100">
              Reputation information will appear after completing team
              projects.
            </p>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              <Briefcase className="h-4 w-4" />
              Collaboration Preferences
            </div>

            <div>
              <label
                htmlFor="experience_level"
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
              >
                Experience Level
              </label>

              <select
                id="experience_level"
                name="experience_level"
                value={profileData.experience_level}
                onChange={handleProfileChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
              >
                Availability
              </label>

              <div className="relative">
                <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                <select
                  id="availability"
                  name="availability"
                  value={profileData.availability}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="">Select availability</option>
                  <option value="part_time">
                    Part-time — up to 10 hours per week
                  </option>
                  <option value="full_time">
                    Full-time — more than 10 hours per week
                  </option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                <User className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                  {profileData.full_name || "Current User"}
                </p>

                <p className="truncate text-xs text-slate-400 dark:text-slate-500">
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