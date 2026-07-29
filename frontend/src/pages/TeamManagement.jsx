import { useEffect, useState } from "react";
import {
  BarChart3,
  Loader2,
  RefreshCw,
  Search,
  Send,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";

import {
  getTeamInvitations,
  getTeamMembers,
  getTeamReadiness,
  removeTeamMember,
  sendTeamInvitation,
} from "../services/teamService";

import {
  getCurrentUser,
  getUserTeams,
  searchUsers,
} from "../services/userService";

import { getRoles } from "../services/roleService";

export default function TeamManagement() {
  const [currentUser, setCurrentUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);

  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [readiness, setReadiness] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [showInvitationForm, setShowInvitationForm] =
    useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isLeader =
    currentUser &&
    activeTeam &&
    currentUser.id === activeTeam.leader_id;

  const clearMessages = () => {
    setMessage("");
    setErrorMessage("");
  };

  const loadTeamData = async (
    teamId,
    leaderAccess = false
  ) => {
    const requests = [
      getTeamMembers(teamId),
      getTeamReadiness(teamId),
    ];

    if (leaderAccess) {
      requests.push(getTeamInvitations(teamId));
    }

    const results = await Promise.all(requests);

    setMembers(results[0]);
    setReadiness(results[1]);
    setInvitations(leaderAccess ? results[2] : []);
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoading(true);
        clearMessages();

        const userData = await getCurrentUser();
        setCurrentUser(userData);

        const [userTeams, roleData] = await Promise.all([
          getUserTeams(userData.id),
          getRoles(),
        ]);

        setTeams(userTeams);
        setRoles(roleData);

        if (userTeams.length > 0) {
          const firstTeam = userTeams[0];

          setActiveTeam(firstTeam);

          await loadTeamData(
            firstTeam.id,
            firstTeam.leader_id === userData.id
          );
        }
      } catch (error) {
        setErrorMessage(
          error.message ||
            "Unable to load team information."
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, []);

  const handleTeamChange = async (event) => {
    const selectedTeam = teams.find(
      (team) => team.id === event.target.value
    );

    if (!selectedTeam) {
      return;
    }

    try {
      setIsLoading(true);
      clearMessages();

      setActiveTeam(selectedTeam);

      await loadTeamData(
        selectedTeam.id,
        selectedTeam.leader_id === currentUser?.id
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to load the selected team."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!activeTeam) {
      return;
    }

    try {
      setIsRefreshing(true);
      clearMessages();

      await loadTeamData(activeTeam.id, isLeader);

      setMessage(
        "Team information refreshed successfully."
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to refresh team information."
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearchUsers = async () => {
    const cleanedQuery = searchQuery.trim();

    if (cleanedQuery.length < 2) {
      setErrorMessage(
        "Enter at least 2 characters to search for a user."
      );
      return;
    }

    try {
      setIsSearching(true);
      clearMessages();

      const results = await searchUsers(cleanedQuery);

      setSearchResults(results);
      setSelectedUser(null);

      if (results.length === 0) {
        setMessage(
          "No matching registered users were found."
        );
      }
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to search for users."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchUsers();
    }
  };

  const handleSendInvitation = async (event) => {
    event.preventDefault();

    if (
      !activeTeam ||
      !selectedUser ||
      !selectedRoleId
    ) {
      setErrorMessage(
        "Select a user and a proposed role."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      clearMessages();

      await sendTeamInvitation(activeTeam.id, {
        invited_user_id: selectedUser.id,
        proposed_role_id: selectedRoleId,
      });

      await loadTeamData(activeTeam.id, true);

      setMessage(
        `Invitation sent successfully to ${selectedUser.full_name}.`
      );

      setSearchQuery("");
      setSearchResults([]);
      setSelectedUser(null);
      setSelectedRoleId("");
      setShowInvitationForm(false);
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to send the invitation."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (member) => {
    if (!activeTeam) {
      return;
    }

    const confirmed = window.confirm(
      `Remove ${member.full_name} from this team?`
    );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();

      await removeTeamMember(
        activeTeam.id,
        member.user_id
      );

      await loadTeamData(activeTeam.id, isLeader);

      setMessage(
        `${member.full_name} was removed from the team.`
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to remove this member."
      );
    }
  };

  const closeInvitationForm = () => {
    setShowInvitationForm(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUser(null);
    setSelectedRoleId("");
    clearMessages();
  };

  const getInitials = (name) => {
    if (!name) {
      return "TM";
    }

    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatInvitationDate = (dateValue) => {
    if (!dateValue) {
      return "Unknown date";
    }

    return new Date(dateValue).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const inputClassName =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950";

  if (isLoading && !activeTeam) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1250px] space-y-5 p-1 text-slate-800 dark:text-slate-100">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Team Management
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage team members, invitations, roles, and
            readiness.
          </p>
        </div>

        {teams.length > 0 && (
          <select
            value={activeTeam?.id || ""}
            onChange={handleTeamChange}
            className={`${inputClassName} max-w-xs`}
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.team_name}
              </option>
            ))}
          </select>
        )}
      </section>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
          {errorMessage}
        </div>
      )}

      {teams.length === 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No team available
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create or join a team before using Team
            Management.
          </p>
        </section>
      ) : (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
          <div className="space-y-4">
            <section className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Team Readiness
                </h2>

                <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>

              <div className="my-6 text-center">
                <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                  {readiness?.readiness_score ?? 0}%
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {readiness?.label || "Not available"}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {readiness?.member_count ?? 0} total member
                  {(readiness?.member_count ?? 0) === 1
                    ? ""
                    : "s"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-indigo-500"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />

                {isRefreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </button>
            </section>

            {isLeader && (
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Team Leader Actions
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowInvitationForm((value) => !value)
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-500"
                >
                  <UserPlus className="h-4 w-4" />
                  Send New Invitation
                </button>
              </section>
            )}

            {isLeader && showInvitationForm && (
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Send Invitation
                  </h2>

                  <button
                    type="button"
                    onClick={closeInvitationForm}
                    className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    aria-label="Close invitation form"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form
                  onSubmit={handleSendInvitation}
                  className="space-y-4"
                >
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Search registered user
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) =>
                          setSearchQuery(event.target.value)
                        }
                        onKeyDown={handleSearchKeyDown}
                        className={inputClassName}
                        placeholder="Name or email"
                      />

                      <button
                        type="button"
                        onClick={handleSearchUsers}
                        disabled={isSearching}
                        className="rounded-lg bg-slate-900 px-3 text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
                      >
                        {isSearching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="max-h-44 space-y-2 overflow-y-auto">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className={`w-full rounded-lg border p-3 text-left transition ${
                            selectedUser?.id === user.id
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                              : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                          }`}
                        >
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {user.full_name}
                          </p>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {user.email}
                          </p>

                          {user.university && (
                            <p className="mt-1 text-xs text-slate-400">
                              {user.university}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Proposed role
                    </label>

                    <select
                      value={selectedRoleId}
                      onChange={(event) =>
                        setSelectedRoleId(event.target.value)
                      }
                      className={inputClassName}
                    >
                      <option value="">Select a role</option>

                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.role_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !selectedUser ||
                      !selectedRoleId
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-indigo-500"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}

                    {isSubmitting
                      ? "Sending..."
                      : "Send Invitation"}
                  </button>
                </form>
              </section>
            )}
          </div>

          <div className="space-y-4 lg:col-span-2">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 p-4 dark:border-slate-800">
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Current Team Members
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {members.length} regular member
                  {members.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {members.length === 0 ? (
                  <p className="p-8 text-center text-sm text-slate-400">
                    No regular members have joined this team
                    yet.
                  </p>
                ) : (
                  members.map((member) => (
                    <div
                      key={member.id}
                      className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {getInitials(member.full_name)}
                        </div>

                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {member.full_name}
                          </p>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {member.email}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            {member.role_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            member.has_committed
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                          }`}
                        >
                          {member.has_committed
                            ? "Committed"
                            : "Pending"}
                        </span>

                        {isLeader && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveMember(member)
                            }
                            className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                            title="Remove member"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {isLeader && (
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">
                      Sent Invitations
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Invitations sent for this team
                    </p>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                    {
                      invitations.filter(
                        (invitation) =>
                          invitation.status === "pending"
                      ).length
                    }{" "}
                    pending
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invitations.length === 0 ? (
                    <p className="p-8 text-center text-sm text-slate-400">
                      No invitations have been sent for this
                      team.
                    </p>
                  ) : (
                    invitations.map((invitation) => (
                      <div
                        key={invitation.id}
                        className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {invitation.invited_user_name}
                          </p>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {invitation.invited_user_email}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            {invitation.proposed_role_name}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
                              invitation.status === "accepted"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                : invitation.status === "declined"
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                            }`}
                          >
                            {invitation.status}
                          </span>

                          <p className="mt-2 text-xs text-slate-400">
                            Sent{" "}
                            {formatInvitationDate(
                              invitation.sent_at
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}