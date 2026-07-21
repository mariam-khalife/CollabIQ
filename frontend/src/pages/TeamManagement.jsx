import { useState } from "react";
import {
  BarChart3,
  Briefcase,
  RefreshCw,
  Send,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";

export default function TeamManagement() {
  const [readiness, setReadiness] = useState(85);
  const [skillCoverage, setSkillCoverage] = useState(92);
  const [availability] = useState(78);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Elena Vance",
      email: "elena.v@university.edu",
      role: "Lead Researcher",
      specialization: "Quantum Computing",
      status: "active",
    },
    {
      id: 2,
      name: "Marcus Thorne",
      email: "m.thorne@collabiq.io",
      role: "Data Architect",
      specialization: "Python / R",
      status: "active",
    },
    {
      id: 3,
      name: "Priya Sharma",
      email: "p.sharma@research.org",
      role: "UI/UX Designer",
      specialization: "Figma / Design Ops",
      status: "offline",
    },
  ]);

  const [invitations, setInvitations] = useState([
    {
      id: 1,
      name: "Jordan Hayes",
      email: "jordan.hayes@example.com",
      role: "Frontend Developer",
      status: "Waiting",
      time: "Sent 2 days ago",
    },
    {
      id: 2,
      name: "Sarah Connor",
      email: "sarah.connor@example.com",
      role: "Backend Developer",
      status: "Sent",
      time: "Delivered",
    },
  ]);

  const [activeAction, setActiveAction] = useState(null);

  const [invitationForm, setInvitationForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [newRole, setNewRole] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRefreshAnalysis = () => {
    setIsAnalyzing(true);
    setErrorMessage("");
    setMessage("");

    setTimeout(() => {
      // Temporary frontend simulation.
      // Later replace this with the real readiness API.
      setReadiness(85);
      setSkillCoverage(92);
      setIsAnalyzing(false);
      setMessage("Team readiness analysis refreshed.");
    }, 700);
  };

  const handleInvitationChange = (event) => {
    const { name, value } = event.target;

    setInvitationForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSendInvitation = (event) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (
      !invitationForm.name.trim() ||
      !invitationForm.email.trim()
    ) {
      setErrorMessage("Name and email are required.");
      return;
    }

    const emailExists = invitations.some(
      (invitation) =>
        invitation.email.toLowerCase() ===
        invitationForm.email.trim().toLowerCase()
    );

    if (emailExists) {
      setErrorMessage(
        "A pending invitation already exists for this email."
      );
      return;
    }

    const newInvitation = {
      id: Date.now(),
      name: invitationForm.name.trim(),
      email: invitationForm.email.trim(),
      role: invitationForm.role.trim() || "Team Member",
      status: "Waiting",
      time: "Sent just now",
    };

    setInvitations((previousInvitations) => [
      newInvitation,
      ...previousInvitations,
    ]);

    setInvitationForm({
      name: "",
      email: "",
      role: "",
    });

    setActiveAction(null);
    setMessage("Invitation sent successfully.");
  };

  const handleAssignRole = (event) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!selectedMemberId) {
      setErrorMessage("Select a team member.");
      return;
    }

    if (!newRole.trim()) {
      setErrorMessage("Enter the new role.");
      return;
    }

    setMembers((previousMembers) =>
      previousMembers.map((member) =>
        member.id === Number(selectedMemberId)
          ? {
              ...member,
              role: newRole.trim(),
            }
          : member
      )
    );

    setSelectedMemberId("");
    setNewRole("");
    setActiveAction(null);
    setMessage("Member role updated successfully.");
  };

  const handleRemoveMember = () => {
    setMessage("");
    setErrorMessage("");

    if (!selectedMemberId) {
      setErrorMessage("Select a team member.");
      return;
    }

    const selectedMember = members.find(
      (member) => member.id === Number(selectedMemberId)
    );

    if (!selectedMember) {
      setErrorMessage("The selected member was not found.");
      return;
    }

    const confirmed = window.confirm(
      `Remove ${selectedMember.name} from the team?`
    );

    if (!confirmed) {
      return;
    }

    setMembers((previousMembers) =>
      previousMembers.filter(
        (member) => member.id !== Number(selectedMemberId)
      )
    );

    setSelectedMemberId("");
    setActiveAction(null);
    setMessage("Team member removed successfully.");
  };

  const handleCancelInvite = (invitationId) => {
    const invitation = invitations.find(
      (currentInvitation) =>
        currentInvitation.id === invitationId
    );

    if (!invitation) {
      return;
    }

    const confirmed = window.confirm(
      `Cancel the invitation sent to ${invitation.name}?`
    );

    if (!confirmed) {
      return;
    }

    setInvitations((previousInvitations) =>
      previousInvitations.filter(
        (currentInvitation) =>
          currentInvitation.id !== invitationId
      )
    );

    setErrorMessage("");
    setMessage("Invitation cancelled successfully.");
  };

  const handleRemindInvite = (invitationId) => {
    setInvitations((previousInvitations) =>
      previousInvitations.map((invitation) =>
        invitation.id === invitationId
          ? {
              ...invitation,
              status: "Reminded",
              time: "Reminder sent just now",
            }
          : invitation
      )
    );

    setErrorMessage("");
    setMessage("Invitation reminder sent.");
  };

  const openAction = (actionName) => {
    setActiveAction(actionName);
    setSelectedMemberId("");
    setNewRole("");
    setMessage("");
    setErrorMessage("");
  };

  const closeAction = () => {
    setActiveAction(null);
    setSelectedMemberId("");
    setNewRole("");
    setInvitationForm({
      name: "",
      email: "",
      role: "",
    });
    setErrorMessage("");
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

  return (
    <div className="mx-auto w-full max-w-[1250px] space-y-5 p-1 text-slate-800 antialiased">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Team Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your team members, roles, invitations, and readiness.
          </p>
        </div>

        <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
          Active Team
        </span>
      </section>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
        <div className="space-y-4">
          <section className="flex flex-col items-center rounded-xl border border-slate-100 bg-white p-4 text-center shadow-sm">
            <div className="mb-3 flex w-full items-center justify-between">
              <h2 className="text-xs font-bold tracking-tight text-slate-900">
                Team Readiness
              </h2>

              <span className="rounded-md bg-indigo-50 p-1.5 text-indigo-600">
                <BarChart3 className="h-4 w-4" />
              </span>
            </div>

            <div className="relative my-2 flex h-28 w-28 items-center justify-center">
              <svg
                className="h-full w-full -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-slate-100"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />

                <path
                  className="text-indigo-600 transition-all duration-500"
                  strokeDasharray={`${readiness}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute text-center">
                <span className="block text-xl font-black tracking-tight">
                  {readiness}%
                </span>

                <span className="-mt-1 block text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Ready
                </span>
              </div>
            </div>

            <div className="mt-4 w-full space-y-3 text-left">
              <div>
                <div className="mb-1 flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Skill Coverage</span>
                  <span className="text-indigo-600">
                    {skillCoverage}%
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full bg-indigo-600 transition-all duration-500"
                    style={{
                      width: `${skillCoverage}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Availability</span>
                  <span className="text-indigo-600">
                    {availability}%
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full bg-indigo-600"
                    style={{
                      width: `${availability}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRefreshAnalysis}
              disabled={isAnalyzing}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  isAnalyzing ? "animate-spin" : ""
                }`}
              />

              {isAnalyzing
                ? "Analyzing Team..."
                : "Refresh Analysis"}
            </button>
          </section>

          <section className="space-y-2.5 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Team Leader Actions
            </span>

            <button
              type="button"
              onClick={() => openAction("invite")}
              className="group flex w-full items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 text-left transition hover:border-slate-200 hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-indigo-600" />

                <span className="text-xs font-bold text-slate-700">
                  Send New Invitation
                </span>
              </div>

              <span className="text-xs text-slate-400 transition group-hover:translate-x-0.5">
                ➔
              </span>
            </button>

            <button
              type="button"
              onClick={() => openAction("role")}
              className="group flex w-full items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 text-left transition hover:border-slate-200 hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-500" />

                <span className="text-xs font-bold text-slate-700">
                  Assign Roles
                </span>
              </div>

              <span className="text-xs text-slate-400 transition group-hover:translate-x-0.5">
                ➔
              </span>
            </button>

            <button
              type="button"
              onClick={() => openAction("remove")}
              className="group flex w-full items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 text-left transition hover:border-slate-200 hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <UserMinus className="h-4 w-4 text-rose-500" />

                <span className="text-xs font-bold text-slate-700">
                  Remove Member
                </span>
              </div>

              <span className="text-xs text-slate-400 transition group-hover:translate-x-0.5">
                ➔
              </span>
            </button>
          </section>

          {activeAction && (
            <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">
                  {activeAction === "invite" &&
                    "Send New Invitation"}

                  {activeAction === "role" &&
                    "Assign Member Role"}

                  {activeAction === "remove" &&
                    "Remove Team Member"}
                </h2>

                <button
                  type="button"
                  onClick={closeAction}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close action form"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {activeAction === "invite" && (
                <form
                  onSubmit={handleSendInvitation}
                  className="space-y-3"
                >
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={invitationForm.name}
                      onChange={handleInvitationChange}
                      placeholder="Enter the user name"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={invitationForm.email}
                      onChange={handleInvitationChange}
                      placeholder="Enter the user email"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      Proposed Role
                    </label>

                    <input
                      type="text"
                      name="role"
                      value={invitationForm.role}
                      onChange={handleInvitationChange}
                      placeholder="Example: Frontend Developer"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send Invitation
                  </button>
                </form>
              )}

              {activeAction === "role" && (
                <form
                  onSubmit={handleAssignRole}
                  className="space-y-3"
                >
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      Team Member
                    </label>

                    <select
                      value={selectedMemberId}
                      onChange={(event) =>
                        setSelectedMemberId(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-500"
                    >
                      <option value="">
                        Select a member
                      </option>

                      {members.map((member) => (
                        <option
                          key={member.id}
                          value={member.id}
                        >
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      New Role
                    </label>

                    <input
                      type="text"
                      value={newRole}
                      onChange={(event) =>
                        setNewRole(event.target.value)
                      }
                      placeholder="Enter the new role"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                    Save Role
                  </button>
                </form>
              )}

              {activeAction === "remove" && (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      Team Member
                    </label>

                    <select
                      value={selectedMemberId}
                      onChange={(event) =>
                        setSelectedMemberId(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-rose-500"
                    >
                      <option value="">
                        Select a member
                      </option>

                      {members.map((member) => (
                        <option
                          key={member.id}
                          value={member.id}
                        >
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveMember}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove Member
                  </button>
                </div>
              )}
            </section>
          )}
        </div>

        <div className="space-y-4 lg:col-span-2">
          <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-50 bg-slate-50/30 p-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-extrabold tracking-tight text-slate-900">
                  Current Team Members
                </h2>

                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  {members.length} contributor
                  {members.length === 1 ? "" : "s"} found
                </p>
              </div>

              <span className="w-fit rounded bg-indigo-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-700">
                Active Project
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/10 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="p-3 pl-4">
                      Member
                    </th>

                    <th className="p-3">Role</th>

                    <th className="p-3">
                      Specialization
                    </th>

                    <th className="p-3 pr-4 text-center">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50 text-xs">
                  {members.map((member) => (
                    <tr
                      key={member.id}
                      className="transition hover:bg-slate-50/40"
                    >
                      <td className="p-3 pl-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 font-bold uppercase text-slate-700">
                            {getInitials(member.name)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-bold leading-tight text-slate-900">
                              {member.name}
                            </p>

                            <p className="mt-0.5 truncate text-[10px] font-normal text-slate-400">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-medium text-slate-600">
                        {member.role}
                      </td>

                      <td className="p-3">
                        <span className="rounded bg-indigo-50/60 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                          {member.specialization}
                        </span>
                      </td>

                      <td className="p-3 pr-4 text-center">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${
                            member.status === "active"
                              ? "bg-emerald-500"
                              : "bg-slate-300"
                          }`}
                        />
                      </td>
                    </tr>
                  ))}

                  {members.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-8 text-center text-xs text-slate-400"
                      >
                        No team members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold tracking-tight text-slate-900">
                  Pending Invitations
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Invitations waiting for a response
                </p>
              </div>

              <span className="text-[11px] font-medium text-slate-400">
                {invitations.length} outstanding
              </span>
            </div>

            <div className="divide-y divide-slate-50">
              {invitations.length === 0 ? (
                <p className="py-5 text-center text-xs text-slate-400">
                  No pending invitations.
                </p>
              ) : (
                invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex flex-col justify-between gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-xs font-bold text-slate-500">
                        {getInitials(invitation.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-900">
                          {invitation.name}
                        </p>

                        <p className="truncate text-[10px] text-slate-400">
                          {invitation.email}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {invitation.role} •{" "}
                          {invitation.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                        {invitation.status}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemindInvite(
                            invitation.id
                          )
                        }
                        className="rounded p-1.5 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-800"
                        title="Send reminder"
                      >
                        <Send className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleCancelInvite(
                            invitation.id
                          )
                        }
                        className="rounded p-1.5 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
                        title="Cancel invitation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}