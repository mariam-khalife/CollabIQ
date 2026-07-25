import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  ChevronRight,
  Lightbulb,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  Users,
  X,
} from "lucide-react";

const initialCandidates = [
  {
    id: 1,
    name: "Elena Vance",
    role: "Backend Developer",
    university: "Stanford University",
    match: 94,
    avatar:
      "https://plus.unsplash.com/premium_photo-1689551671541-31a345ce6ae0?w=500&auto=format&fit=crop&q=60",
    tags: ["Python", "FastAPI", "PostgreSQL", "REST APIs", "Docker"],
    experience: "6+ Years",
    availability: "Immediately",
    availabilityColor: "emerald",
    reason:
      "Strong backend development and API experience aligned with your project requirements.",
    bio:
      "Elena focuses on backend systems, scalable APIs, database architecture, and reliable cloud-based application development.",
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "AI/ML Engineer",
    university: "MIT",
    match: 88,
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60",
    tags: [
      "Machine Learning",
      "NLP",
      "Python",
      "Scikit-learn",
      "PyTorch",
    ],
    experience: "4+ Years",
    availability: "2 Weeks",
    availabilityColor: "amber",
    reason:
      "Brings strong AI and NLP expertise that can improve the project’s recommendation features.",
    bio:
      "Marcus specializes in machine learning, natural language processing, intelligent recommendation systems, and production AI integration.",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "UI/UX Designer",
    university: "ETH Zurich",
    match: 82,
    avatar:
      "https://media.istockphoto.com/id/1092821522/photo/portrait-of-a-young-beautiful-well-dressed-business-woman.jpg?s=1024x1024&w=is&k=20",
    tags: [
      "UI/UX Design",
      "Figma",
      "Prototyping",
      "User Research",
      "Tailwind CSS",
    ],
    experience: "2+ Years",
    availability: "Immediately",
    availabilityColor: "emerald",
    reason:
      "Provides strong user-interface design skills and experience with modern product design tools.",
    bio:
      "Sarah works on accessible interfaces, user research, responsive design systems, prototyping, and product usability.",
  },
];

export default function AiMatching() {
  const [toast, setToast] = useState("");
  const [invitedIds, setInvitedIds] = useState([]);
  const [selectedCandidate, setSelectedCandidate] =
    useState(null);

  const [isParamOpen, setIsParamOpen] = useState(false);
  const [minMatch, setMinMatch] = useState(80);
  const [targetRole, setTargetRole] = useState(
    "Backend Developer"
  );

  const candidates = useMemo(() => {
    return initialCandidates
      .filter((candidate) => candidate.match >= minMatch)
      .slice(0, 5);
  }, [minMatch]);

  const showToast = (message) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const toggleInvite = (candidate) => {
    const isAlreadyInvited = invitedIds.includes(candidate.id);

    if (isAlreadyInvited) {
      setInvitedIds((previousIds) =>
        previousIds.filter((id) => id !== candidate.id)
      );

      showToast(
        `Invitation for ${candidate.name} was cancelled.`
      );

      return;
    }

    setInvitedIds((previousIds) => [
      ...previousIds,
      candidate.id,
    ]);

    showToast(
      `Invitation sent successfully to ${candidate.name}.`
    );
  };

  const getAvailabilityClasses = (color) => {
    if (color === "amber") {
      return {
        dot: "bg-amber-500",
        text: "text-amber-600 dark:text-amber-400",
      };
    }

    return {
      dot: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
    };
  };

  return (
    <div className="relative mx-auto w-full max-w-[1400px] space-y-6 text-slate-800 antialiased dark:text-slate-100">
      {toast && (
        <div className="fixed right-5 top-5 z-[70] flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-xl dark:border dark:border-slate-700 dark:bg-slate-800">
          <Check className="h-4 w-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Header */}
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <span className="inline-flex rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
            AI Team Matching
          </span>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Top teammate recommendations for your project
          </h1>

          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            We analyzed student profiles to identify the strongest
            candidates based on your project requirements, missing
            skills, experience, and availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsParamOpen(true)}
          className="flex w-fit items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-xs font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
        >
          <Settings2 className="h-4 w-4" />
          Adjust Matching Criteria
          <ChevronRight className="h-4 w-4" />
        </button>
      </section>

      {/* Project information */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-indigo-600 p-3 text-white shadow-sm">
            <Lightbulb className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
              Project:{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                CollabIQ Platform
              </span>
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Required skills:
              </span>{" "}
              Python, FastAPI, PostgreSQL, AI, UI/UX Design,
              React, and teamwork.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-xl border border-indigo-200 px-4 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
        >
          View Project Details
        </button>
      </section>

      {/* Candidate recommendations */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recommended Teammates
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Showing up to five of the strongest matches.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {candidates.length} recommendation
            {candidates.length === 1 ? "" : "s"}
          </span>
        </div>

        {candidates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <Users className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500" />

            <h3 className="mt-3 font-bold text-slate-800 dark:text-slate-200">
              No matching candidates found
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Lower the minimum match percentage to see more
              recommendations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {candidates.map((candidate, index) => {
              const isInvited = invitedIds.includes(candidate.id);
              const availability = getAvailabilityClasses(
                candidate.availabilityColor
              );

              return (
                <article
                  key={candidate.id}
                  className="flex min-h-[500px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-slate-50 dark:ring-slate-800"
                      />

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
                          {candidate.university}
                        </p>
                      </div>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-indigo-500 bg-indigo-50 text-sm font-black text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                      {candidate.match}%
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Top Skills
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {candidate.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Why this candidate matches
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

                      <p className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                        {candidate.experience}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Availability
                      </p>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${availability.dot}`}
                        />

                        <p
                          className={`text-xs font-bold ${availability.text}`}
                        >
                          {candidate.availability}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCandidate(candidate)
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      View Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleInvite(candidate)}
                      className={`rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                        isInvited
                          ? "border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500"
                      }`}
                    >
                      {isInvited
                        ? "Cancel Invite"
                        : "Invite to Team"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* AI analysis */}
      <section className="overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-700 to-violet-700 text-white shadow-lg dark:border-indigo-400/20">
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
                  Why these teammates were recommended
                </h2>
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-indigo-100">
              The recommendation engine compared your project
              requirements with candidate skills, experience,
              availability, and potential contribution. The current
              team has a significant need for a{" "}
              <span className="font-bold text-white">
                {targetRole}
              </span>
              , so candidates with that specialization received a
              stronger ranking.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <Target className="h-5 w-5 text-indigo-100" />

                <p className="mt-3 text-sm font-bold">
                  Skill Alignment
                </p>

                <p className="mt-1 text-xs leading-relaxed text-indigo-100">
                  Candidate skills are compared with missing project
                  requirements.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <User className="h-5 w-5 text-indigo-100" />

                <p className="mt-3 text-sm font-bold">
                  Contribution Potential
                </p>

                <p className="mt-1 text-xs leading-relaxed text-indigo-100">
                  Experience and role suitability influence candidate
                  rankings.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <ShieldCheck className="h-5 w-5 text-indigo-100" />

                <p className="mt-3 text-sm font-bold">
                  Team Compatibility
                </p>

                <p className="mt-1 text-xs leading-relaxed text-indigo-100">
                  Availability and complementary strengths improve
                  the final match.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-white/10 bg-slate-950/15 p-5 backdrop-blur-sm">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>Overall Match Quality</span>
                <span>92%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-indigo-950/40">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: "92%" }}
                />
              </div>

              <p className="mt-2 text-xs text-indigo-100">
                Excellent compatibility across the recommended
                candidates.
              </p>
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>Skill Coverage</span>
                <span>78%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-indigo-950/40">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: "78%" }}
                />
              </div>

              <p className="mt-2 text-xs text-indigo-100">
                Most required project skills are represented across
                the top recommendations.
              </p>
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>Availability Fit</span>
                <span>86%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-indigo-950/40">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: "86%" }}
                />
              </div>

              <p className="mt-2 text-xs text-indigo-100">
                Recommended candidates are available within the
                project’s expected schedule.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsParamOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <Settings2 className="h-4 w-4" />
              Refine Recommendations
            </button>
          </div>
        </div>
      </section>

      {/* Candidate profile modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setSelectedCandidate(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close profile"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 pr-8">
              <img
                src={selectedCandidate.avatar}
                alt={selectedCandidate.name}
                className="h-16 w-16 rounded-2xl object-cover"
              />

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedCandidate.name}
                </h3>

                <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {selectedCandidate.role}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {selectedCandidate.university}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {selectedCandidate.bio}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Verified Skills
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCandidate.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                toggleInvite(selectedCandidate);
                setSelectedCandidate(null);
              }}
              className={`mt-6 w-full rounded-xl py-3 text-sm font-bold transition ${
                invitedIds.includes(selectedCandidate.id)
                  ? "border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500"
              }`}
            >
              {invitedIds.includes(selectedCandidate.id)
                ? "Cancel Team Invitation"
                : "Send Team Invitation"}
            </button>
          </div>
        </div>
      )}

      {/* Matching criteria drawer */}
      {isParamOpen && (
         <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-950/60 backdrop-blur-sm">
          <div className="flex h-screen w-full max-w-sm flex-col justify-between border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Adjust Matching Criteria
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Refine how the recommendation engine ranks
                    potential teammates.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsParamOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label="Close matching criteria"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 space-y-7">
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="minimum-match"
                      className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Minimum Match Score
                    </label>

                    <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                      {minMatch}%+
                    </span>
                  </div>

                  <input
                    id="minimum-match"
                    type="range"
                    min="70"
                    max="95"
                    step="1"
                    value={minMatch}
                    onChange={(event) =>
                      setMinMatch(Number(event.target.value))
                    }
                    className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600 dark:bg-slate-700"
                  />

                  <div className="mt-2 flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                    <span>70%</span>
                    <span>95%</span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="target-role"
                    className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Priority Team Role
                  </label>

                  <select
                    id="target-role"
                    value={targetRole}
                    onChange={(event) =>
                      setTargetRole(event.target.value)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="Backend Developer">
                      Backend Developer
                    </option>

                    <option value="AI/ML Engineer">
                      AI/ML Engineer
                    </option>

                    <option value="UI/UX Designer">
                      UI/UX Designer
                    </option>

                    <option value="Database Engineer">
                      Database Engineer
                    </option>

                    <option value="Frontend Developer">
                      Frontend Developer
                    </option>
                  </select>
                </div>

                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
                  <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    Current recommendation result
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-indigo-600 dark:text-indigo-400">
                    {candidates.length} candidate
                    {candidates.length === 1 ? "" : "s"} currently
                    meet the selected minimum match score.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsParamOpen(false)}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-500"
            >
              Apply Matching Criteria
            </button>
          </div>
        </div>
      )}
    </div>
  );
}