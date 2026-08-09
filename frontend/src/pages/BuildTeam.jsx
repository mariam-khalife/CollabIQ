import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  UserPlus,
  Users,
  CheckCircle2,
} from "lucide-react";

import {
  createTeam,
  sendTeamInvitation,
} from "../services/teamService";
import { searchUsers } from "../services/userService";
import { getRoles } from "../services/roleService";
import { getTeammateRecommendations } from "../services/teammateRecommendationService";

function BuildTeam() {
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState("");
  const [createdTeam, setCreatedTeam] = useState(null);

  const [roles, setRoles] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [selectedRoles, setSelectedRoles] = useState({});

  const [aiRole, setAiRole] = useState("Backend Developer");
  const [recommendations, setRecommendations] = useState([]);

  const [isCreating, setIsCreating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await getRoles();
        setRoles(response || []);
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    };

    loadRoles();
  }, []);

  const handleCreateTeam = async (event) => {
    event.preventDefault();

    if (!teamName.trim()) {
      setError("Please enter a team name.");
      return;
    }

    try {
      setIsCreating(true);
      setError("");
      setMessage("");

      const team = await createTeam({
        team_name: teamName.trim(),
      });

      setCreatedTeam(team);
      setMessage("Team created successfully.");
    } catch (err) {
      console.error("Create team error:", err);
      setError(err.message || "Failed to create team.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    try {
      setIsSearching(true);
      setError("");
      setSearchResults([]);

      const results = await searchUsers(searchQuery.trim());

      setSearchResults(results || []);
    } catch (err) {
      console.error("Search users error:", err);
      setError(err.message || "Unable to search users.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleRoleChange = (userId, roleId) => {
    setSelectedRoles((previous) => ({
      ...previous,
      [userId]: roleId,
    }));
  };

  const handleInvite = async (user) => {
    if (!createdTeam) {
      setError("Create the team first.");
      return;
    }

    const roleId = selectedRoles[user.id];

    if (!roleId) {
      setError(`Please select a role for ${user.full_name}.`);
      return;
    }

    try {
      setError("");
      setMessage("");

      await sendTeamInvitation(createdTeam.id, {
        invited_user_id: user.id,
        proposed_role_id: roleId,
      });

      setMessage(`Invitation sent to ${user.full_name}.`);
    } catch (err) {
      console.error("Invitation error:", err);
      setError(err.message || "Failed to send invitation.");
    }
  };

  const handleGetAiSuggestions = async () => {
    if (!createdTeam) {
      setError("Create the team before requesting AI suggestions.");
      return;
    }

    try {
      setIsLoadingAi(true);
      setError("");
      setRecommendations([]);

      const response = await getTeammateRecommendations(
        createdTeam.id,
        {
          targetRole: aiRole,
          maximumResults: 5,
        }
      );

      setRecommendations(response || []);
    } catch (err) {
      console.error("AI recommendation error:", err);
      setError(
        err.message || "Unable to load teammate recommendations."
      );
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Build New Team
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create your team, invite people you know, or discover
          suitable teammates using AI recommendations.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </div>
      )}

      {!createdTeam ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3">
              <Users className="h-6 w-6 text-indigo-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Create your team
              </h2>

              <p className="text-sm text-slate-500">
                Start by choosing a name for your new team.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreateTeam}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={teamName}
              onChange={(event) =>
                setTeamName(event.target.value)
              }
              placeholder="e.g. CollabIQ Team"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="submit"
              disabled={isCreating}
              className="rounded-xl bg-indigo-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? "Creating..." : "Create Team"}
            </button>
          </form>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Active Team
            </p>

            <h2 className="mt-1 text-xl font-bold text-indigo-950">
              {createdTeam.team_name}
            </h2>

            <p className="mt-1 text-sm text-indigo-700">
              Your team has been created. You can now invite
              members manually or use AI suggestions.
            </p>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <Search className="h-5 w-5 text-indigo-700" />

                  <h2 className="text-lg font-semibold text-slate-900">
                    Invite someone you know
                  </h2>
                </div>

                <p className="text-sm text-slate-500">
                  Search existing CollabIQ users by their name
                  or email address.
                </p>
              </div>

              <form
                onSubmit={handleSearch}
                className="mb-5 flex gap-2"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search by name or email..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                />

                <button
                  type="submit"
                  disabled={isSearching}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </form>

              <div className="space-y-3">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {user.full_name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <select
                        value={selectedRoles[user.id] || ""}
                        onChange={(event) =>
                          handleRoleChange(
                            user.id,
                            event.target.value
                          )
                        }
                        className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        <option value="">
                          Select proposed role
                        </option>

                        {roles.map((role) => (
                          <option
                            key={role.id}
                            value={role.id}
                          >
                            {role.role_name}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleInvite(user)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
                      >
                        <UserPlus className="h-4 w-4" />
                        Invite
                      </button>
                    </div>
                  </div>
                ))}

                {!isSearching &&
                  searchQuery &&
                  searchResults.length === 0 && (
                    <p className="py-4 text-center text-sm text-slate-400">
                      No matching users found.
                    </p>
                  )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-700" />

                  <h2 className="text-lg font-semibold text-slate-900">
                    AI Teammate Suggestions
                  </h2>
                </div>

                <p className="text-sm text-slate-500">
                  Let CollabIQ suggest suitable users based on
                  the role you need.
                </p>
              </div>

              <div className="mb-5 flex flex-col gap-2 sm:flex-row">
                <select
                  value={aiRole}
                  onChange={(event) =>
                    setAiRole(event.target.value)
                  }
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                >
                  {roles.map((role) => (
                    <option
                      key={role.id}
                      value={role.role_name}
                    >
                      {role.role_name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleGetAiSuggestions}
                  disabled={isLoadingAi}
                  className="rounded-xl bg-indigo-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {isLoadingAi
                    ? "Finding..."
                    : "Get Suggestions"}
                </button>
              </div>

              <div className="space-y-3">
                {recommendations.map((recommendation) => {
                  const user =
                    recommendation.user ||
                    recommendation.suggested_user ||
                    recommendation;

                  const userId =
                    user.id ||
                    recommendation.suggested_user_id;

                  const matchedRole = roles.find(
                    (role) => role.role_name === aiRole
                  );

                  return (
                    <div
                      key={userId}
                      className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {user.full_name ||
                              recommendation.full_name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {user.email ||
                              recommendation.email}
                          </p>
                        </div>

                        {recommendation.score !== undefined && (
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-indigo-700">
                            {Math.round(
                              recommendation.score * 100
                            )}
                            % match
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={!matchedRole}
                        onClick={() =>
                          handleInvite({
                            id: userId,
                            full_name:
                              user.full_name ||
                              recommendation.full_name,
                          })
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50"
                      >
                        <UserPlus className="h-4 w-4" />
                        Invite to Team
                      </button>
                    </div>
                  );
                })}

                {!isLoadingAi &&
                  recommendations.length === 0 && (
                    <p className="py-4 text-center text-sm text-slate-400">
                      Choose a role and request AI suggestions.
                    </p>
                  )}
              </div>
            </section>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                navigate("/team-management")
              }
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
            >
              Continue to Team Management
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default BuildTeam;