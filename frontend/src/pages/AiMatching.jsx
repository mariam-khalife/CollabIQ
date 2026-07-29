import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Lightbulb,
  Loader2,
  Mail,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  Users,
  X,
} from "lucide-react";

import {
  getCurrentUser,
  getUserTeams,
} from "../services/userService";

import {
  getTeam,
  sendTeamInvitation,
} from "../services/teamService";

import { getRoles } from "../services/roleService";

import {
  getTeammateRecommendations,
} from "../services/teammateRecommendationService";

export default function AiMatching() {
  const [currentUser, setCurrentUser] = useState(null);

  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] =
    useState("");
  const [selectedTeam, setSelectedTeam] =
    useState(null);

  const [roles, setRoles] = useState([]);
  const [recommendations, setRecommendations] =
    useState([]);

  const [targetRole, setTargetRole] =
    useState("");

  const [minimumScore, setMinimumScore] =
    useState(0);

  const [requiredSkills, setRequiredSkills] =
    useState("");

  const [
    requiredInterests,
    setRequiredInterests,
  ] = useState("");

  const [
    selectedCandidate,
    setSelectedCandidate,
  ] = useState(null);

  const [
    isCriteriaOpen,
    setIsCriteriaOpen,
  ] = useState(false);

  const [isLoadingPage, setIsLoadingPage] =
    useState(true);

  const [
    isLoadingRecommendations,
    setIsLoadingRecommendations,
  ] = useState(false);

  const [
    processingCandidateId,
    setProcessingCandidateId,
  ] = useState(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] =
    useState("");

  const clearMessages = () => {
    setMessage("");
    setErrorMessage("");
  };

  const parseCommaSeparatedValues = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const loadInitialData = async () => {
    try {
      setIsLoadingPage(true);
      clearMessages();

      const [userData, rolesData] =
        await Promise.all([
          getCurrentUser(),
          getRoles(),
        ]);

      setCurrentUser(userData);
      setRoles(rolesData);

      if (rolesData.length > 0) {
        setTargetRole(
          rolesData[0].role_name
        );
      }

      const userTeams = await getUserTeams(
        userData.id
      );

      const leaderTeams = userTeams.filter(
        (team) =>
          String(team.leader_id) ===
          String(userData.id)
      );

      setTeams(leaderTeams);

      if (leaderTeams.length > 0) {
        setSelectedTeamId(
          leaderTeams[0].id
        );
      }
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to load AI team matching data."
      );
    } finally {
      setIsLoadingPage(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadSelectedTeam = async () => {
      if (!selectedTeamId) {
        setSelectedTeam(null);
        return;
      }

      try {
        const teamData = await getTeam(
          selectedTeamId
        );

        setSelectedTeam(teamData);
      } catch (error) {
        setErrorMessage(
          error.message ||
            "Unable to load the selected team."
        );
      }
    };

    loadSelectedTeam();
  }, [selectedTeamId]);

  const loadRecommendations = async () => {
    if (!selectedTeamId || !targetRole) {
      setRecommendations([]);
      return;
    }

    try {
      setIsLoadingRecommendations(true);
      clearMessages();

      const data =
        await getTeammateRecommendations(
          selectedTeamId,
          {
            targetRole,
            requiredSkills:
              parseCommaSeparatedValues(
                requiredSkills
              ),
            requiredInterests:
              parseCommaSeparatedValues(
                requiredInterests
              ),
            minimumScore:
              minimumScore / 100,
            maximumResults: 5,
          }
        );

      setRecommendations(data);
    } catch (error) {
      setRecommendations([]);

      setErrorMessage(
        error.message ||
          "Unable to generate teammate recommendations."
      );
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    if (
      selectedTeamId &&
      targetRole
    ) {
      loadRecommendations();
    }
  }, [selectedTeamId, targetRole]);

  const getRoleIdByName = (roleName) => {
    const normalizedRoleName =
      roleName.trim().toLowerCase();

    const matchingRole = roles.find(
      (role) =>
        role.role_name
          .trim()
          .toLowerCase() ===
        normalizedRoleName
    );

    return matchingRole?.id || null;
  };

  const handleInvite = async (
    candidate
  ) => {
    const roleId = getRoleIdByName(
      candidate.role
    );

    if (!roleId) {
      setErrorMessage(
        `The role "${candidate.role}" does not exist in the roles table.`
      );
      return;
    }

    try {
      setProcessingCandidateId(
        candidate.user_id
      );

      clearMessages();

      await sendTeamInvitation(
        selectedTeamId,
        {
          invited_user_id:
            candidate.user_id,
          proposed_role_id: roleId,
        }
      );

      setRecommendations(
        (currentRecommendations) =>
          currentRecommendations.filter(
            (item) =>
              item.user_id !==
              candidate.user_id
          )
      );

      setSelectedCandidate(null);

      setMessage(
        `Invitation sent successfully to ${candidate.name}.`
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to send the team invitation."
      );
    } finally {
      setProcessingCandidateId(null);
    }
  };

  const candidateCards = useMemo(() => {
    return recommendations.map(
      (candidate) => {
        const matchPercentage =
          Math.round(
            Number(
              candidate.compatibility_score ||
                0
            ) * 100
          );

        return {
          ...candidate,
          matchPercentage,

          displaySkills:
            candidate.skills?.length > 0
              ? candidate.skills
              : ["No skills added"],

          displayInterests:
            candidate.interests?.length > 0
              ? candidate.interests
              : [],

          displayUniversity:
            candidate.university ||
            "University not provided",

          displayEmail:
            candidate.email ||
            "Email not provided",

          displayAvailability:candidate.availability
            ? candidate.availability
              .replaceAll("_", " ")
              .replace(/\b\w/g, (letter) => letter.toUpperCase())
            : "Not specified",

          displayExperience:
            candidate.experience_level ||
            "Not specified",

          displayBio:
            candidate.bio ||
            "This candidate has not added a biography yet.",
        };
      }
    );
  }, [recommendations]);

  const overallMatchQuality = useMemo(() => {
    if (candidateCards.length === 0) {
      return 0;
    }

    const total = candidateCards.reduce(
      (sum, candidate) =>
        sum +
        candidate.matchPercentage,
      0
    );

    return Math.round(
      total / candidateCards.length
    );
  }, [candidateCards]);

  const skillCoverage = useMemo(() => {
    const requestedSkills =
      parseCommaSeparatedValues(
        requiredSkills
      );

    if (
      requestedSkills.length === 0 ||
      candidateCards.length === 0
    ) {
      return 0;
    }

    const normalizedCandidateSkills =
      new Set(
        candidateCards.flatMap(
          (candidate) =>
            (candidate.skills || []).map(
              (skill) =>
                skill
                  .trim()
                  .toLowerCase()
            )
        )
      );

    const matchedCount =
      requestedSkills.filter((skill) =>
        normalizedCandidateSkills.has(
          skill
            .trim()
            .toLowerCase()
        )
      ).length;

    return Math.round(
      (matchedCount /
        requestedSkills.length) *
        100
    );
  }, [
    candidateCards,
    requiredSkills,
  ]);

  const availabilityFit = useMemo(() => {
    if (candidateCards.length === 0) {
      return 0;
    }

    const unavailableValues = new Set([
      "",
      "not specified",
      "unavailable",
      "not available",
      "no",
      "false",
    ]);

    const availableCount =
      candidateCards.filter(
        (candidate) =>
          !unavailableValues.has(
            candidate.displayAvailability
              .trim()
              .toLowerCase()
          )
      ).length;

    return Math.round(
      (availableCount /
        candidateCards.length) *
        100
    );
  }, [candidateCards]);

  const isAvailable = (availability) => {
    const normalized =
      availability
        .trim()
        .toLowerCase();

    return ![
      "",
      "not specified",
      "unavailable",
      "not available",
      "no",
      "false",
    ].includes(normalized);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (isLoadingPage) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[1400px] space-y-6 text-slate-800 antialiased dark:text-slate-100">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <span className="inline-flex rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
            AI Team Matching
          </span>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Top teammate recommendations
            for your team
          </h1>

          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Candidate profiles are ranked
            according to skills, interests,
            experience, availability, and
            the selected team role.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setIsCriteriaOpen(true)
          }
          disabled={!selectedTeamId}
          className="flex w-fit items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-xs font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
        >
          <Settings2 className="h-4 w-4" />
          Adjust Matching Criteria
          <ChevronRight className="h-4 w-4" />
        </button>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-indigo-600 p-3 text-white shadow-sm">
              <Lightbulb className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                Team:{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  {selectedTeam?.team_name ||
                    "Select a team"}
                </span>
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Target role:{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {targetRole ||
                    "Not selected"}
                </span>
              </p>
            </div>
          </div>

          <div className="w-full lg:w-72">
            <label
              htmlFor="team-selection"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Select Leader Team
            </label>

            <select
              id="team-selection"
              value={selectedTeamId}
              onChange={(event) =>
                setSelectedTeamId(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {teams.length === 0 ? (
                <option value="">
                  You do not lead any teams
                </option>
              ) : (
                teams.map((team) => (
                  <option
                    key={team.id}
                    value={team.id}
                  >
                    {team.team_name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recommended Teammates
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Showing up to five of the
              strongest eligible candidates.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {candidateCards.length}{" "}
            recommendation
            {candidateCards.length === 1
              ? ""
              : "s"}
          </span>
        </div>

        {isLoadingRecommendations ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : candidateCards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <Users className="mx-auto h-8 w-8 text-slate-400" />

            <h3 className="mt-3 font-bold text-slate-800 dark:text-slate-200">
              No recommendations found
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try lowering the minimum
              score or changing the target
              role.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {candidateCards.map(
              (candidate, index) => {
                const candidateIsAvailable =
                  isAvailable(
                    candidate.displayAvailability
                  );

                return (
                  <article
                    key={candidate.user_id}
                    className="flex min-h-[530px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-black text-indigo-700 ring-4 ring-slate-50 dark:bg-indigo-950/60 dark:text-indigo-300 dark:ring-slate-800">
                          {getInitials(
                            candidate.name
                          )}
                        </div>

                        <div className="min-w-0">
                          {index === 0 && (
                            <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                              <Sparkles className="h-3 w-3" />
                              Top Match
                            </span>
                          )}

                          <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                            {candidate.name}
                          </h3>

                          <p className="mt-0.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            {candidate.role}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                            {
                              candidate.displayUniversity
                            }
                          </p>

                          <div className="mt-1 flex min-w-0 items-center gap-1 text-xs text-slate-400">
                            <Mail className="h-3 w-3 shrink-0" />

                            <span className="truncate">
                              {
                                candidate.displayEmail
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-indigo-500 bg-indigo-50 text-sm font-black text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                        {
                          candidate.matchPercentage
                        }
                        %
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Top Skills
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {candidate.displaySkills.map(
                          (skill) => (
                            <span
                              key={skill}
                              className="rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Why this candidate
                        matches
                      </p>

                      <div className="mt-3 flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-emerald-500 p-0.5 text-white" />

                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {candidate.reason}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Experience
                        </p>

                        <p className="mt-1 text-xs font-bold capitalize text-slate-800 dark:text-slate-200">
                          {
                            candidate.displayExperience
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Availability
                        </p>

                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              candidateIsAvailable
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />

                          <p
                            className={`text-xs font-bold ${
                              candidateIsAvailable
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {
                              candidate.displayAvailability
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCandidate(
                            candidate
                          )
                        }
                        className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        View Profile
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleInvite(
                            candidate
                          )
                        }
                        disabled={
                          processingCandidateId ===
                          candidate.user_id
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-indigo-500"
                      >
                        {processingCandidateId ===
                        candidate.user_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : null}

                        Invite to Team
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-700 to-violet-700 text-white shadow-lg">
        <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-[1.3fr_1fr] lg:p-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <Sparkles className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                  AI Matching Analysis
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Why these teammates were
                  recommended
                </h2>
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-indigo-100">
              The recommendation engine
              compared candidate profiles
              with the selected role,
              required skills, interests,
              experience, and availability.
              Current members, team leaders,
              and pending invitees were
              excluded.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <AnalysisCard
                icon={Target}
                title="Skill Alignment"
                text="Candidate skills are compared with the selected project requirements."
              />

              <AnalysisCard
                icon={User}
                title="Contribution Potential"
                text="Experience and role suitability influence the final ranking."
              />

              <AnalysisCard
                icon={ShieldCheck}
                title="Team Compatibility"
                text="Availability and complementary interests improve the match."
              />
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-white/10 bg-slate-950/15 p-5">
            <AnalysisProgress
              label="Overall Match Quality"
              value={overallMatchQuality}
            />

            <AnalysisProgress
              label="Skill Coverage"
              value={skillCoverage}
            />

            <AnalysisProgress
              label="Availability Fit"
              value={availabilityFit}
            />

            <button
              type="button"
              onClick={() =>
                setIsCriteriaOpen(true)
              }
              disabled={!selectedTeamId}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/20 disabled:opacity-50"
            >
              <Settings2 className="h-4 w-4" />
              Refine Recommendations
            </button>
          </div>
        </div>
      </section>

      {selectedCandidate && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() =>
                setSelectedCandidate(null)
              }
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              aria-label="Close profile"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 pr-8">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {getInitials(
                  selectedCandidate.name
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedCandidate.name}
                </h3>

                <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {selectedCandidate.role}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {
                    selectedCandidate.displayUniversity
                  }
                </p>

                <p className="mt-1 truncate text-xs text-slate-400">
                  {
                    selectedCandidate.displayEmail
                  }
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {
                  selectedCandidate.displayBio
                }
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Skills
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCandidate.displaySkills.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            {selectedCandidate
              .displayInterests.length >
              0 && (
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Interests
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedCandidate.displayInterests.map(
                    (interest) => (
                      <span
                        key={interest}
                        className="rounded-md bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                      >
                        {interest}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                handleInvite(
                  selectedCandidate
                )
              }
              disabled={
                processingCandidateId ===
                selectedCandidate.user_id
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50 dark:hover:bg-indigo-500"
            >
              {processingCandidateId ===
              selectedCandidate.user_id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}

              Send Team Invitation
            </button>
          </div>
        </div>
      )}

      {isCriteriaOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-950/60 backdrop-blur-sm">
          <div className="flex h-screen w-full max-w-sm flex-col justify-between overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Adjust Matching Criteria
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Refine the teammate
                    recommendation ranking.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsCriteriaOpen(false)
                  }
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close criteria"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="minimum-score"
                      className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Minimum Match Score
                    </label>

                    <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                      {minimumScore}%
                    </span>
                  </div>

                  <input
                    id="minimum-score"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={minimumScore}
                    onChange={(event) =>
                      setMinimumScore(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600 dark:bg-slate-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="target-role"
                    className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Target Role
                  </label>

                  <select
                    id="target-role"
                    value={targetRole}
                    onChange={(event) =>
                      setTargetRole(
                        event.target.value
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
                </div>

                <div>
                  <label
                    htmlFor="required-skills"
                    className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Required Skills
                  </label>

                  <input
                    id="required-skills"
                    type="text"
                    value={requiredSkills}
                    onChange={(event) =>
                      setRequiredSkills(
                        event.target.value
                      )
                    }
                    placeholder="Python, FastAPI, PostgreSQL"
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />

                  <p className="mt-2 text-[11px] text-slate-400">
                    Separate skills using
                    commas.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="required-interests"
                    className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Required Interests
                  </label>

                  <input
                    id="required-interests"
                    type="text"
                    value={requiredInterests}
                    onChange={(event) =>
                      setRequiredInterests(
                        event.target.value
                      )
                    }
                    placeholder="AI, Backend Development"
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />

                  <p className="mt-2 text-[11px] text-slate-400">
                    Separate interests using
                    commas.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                setIsCriteriaOpen(false);
                await loadRecommendations();
              }}
              disabled={
                isLoadingRecommendations ||
                !selectedTeamId ||
                !targetRole
              }
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-indigo-500"
            >
              {isLoadingRecommendations && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              Apply Matching Criteria
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalysisCard({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-4">
      <Icon className="h-5 w-5 text-indigo-100" />

      <p className="mt-3 text-sm font-bold">
        {title}
      </p>

      <p className="mt-1 text-xs leading-relaxed text-indigo-100">
        {text}
      </p>
    </div>
  );
}

function AnalysisProgress({
  label,
  value,
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-indigo-950/40">
        <div
          className="h-full rounded-full bg-white transition-all duration-300"
          style={{
            width: `${Math.min(
              Math.max(value, 0),
              100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}