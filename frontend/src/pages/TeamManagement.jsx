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
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  User,
  AtSign,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRefreshAnalysis = () => {
    setIsAnalyzing(true);
    setErrorMessage("");
    setMessage("");

    setTimeout(() => {
      setReadiness(Math.floor(Math.random() * 15) + 80);
      setSkillCoverage(Math.floor(Math.random() * 15) + 85);
      setIsAnalyzing(false);
      setMessage("Team readiness analysis refreshed.");
      
      setTimeout(() => setMessage(""), 4000);
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
    setIsSubmitting(true);
    setMessage("");
    setErrorMessage("");

    if (!invitationForm.name.trim() || !invitationForm.email.trim()) {
      setErrorMessage("Name and email are required.");
      setIsSubmitting(false);
      return;
    }

    const emailExists = invitations.some(
      (invitation) =>
        invitation.email.toLowerCase() === invitationForm.email.trim().toLowerCase()
    );

    if (emailExists) {
      setErrorMessage("A pending invitation already exists for this email.");
      setIsSubmitting(false);
      return;
    }

    const newInvitation = {
      id: Date.now(),
      name: invitationForm.name.trim(),
      email: invitationForm.email.trim(),
      role: invitationForm.role.trim() || "Team Member",
      status: "Pending",
      time: "Sent just now",
    };

    setInvitations((previousInvitations) => [
      newInvitation,
      ...previousInvitations,
    ]);

    setInvitationForm({ name: "", email: "", role: "" });
    setActiveAction(null);
    setMessage("🎉 Invitation sent successfully!");
    setIsSubmitting(false);

    setTimeout(() => setMessage(""), 4000);
  };

  const handleAssignRole = (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!selectedMemberId) {
      setErrorMessage("Please select a team member.");
      return;
    }

    if (!newRole.trim()) {
      setErrorMessage("Please enter the new role.");
      return;
    }

    setMembers((previousMembers) =>
      previousMembers.map((member) =>
        member.id === Number(selectedMemberId)
          ? { ...member, role: newRole.trim() }
          : member
      )
    );

    setSelectedMemberId("");
    setNewRole("");
    setActiveAction(null);
    setMessage("✅ Member role updated successfully.");

    setTimeout(() => setMessage(""), 4000);
  };

  const handleRemoveMember = () => {
    setMessage("");
    setErrorMessage("");

    if (!selectedMemberId) {
      setErrorMessage("Please select a team member.");
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
      `Remove ${selectedMember.name} from the team? This action cannot be undone.`
    );

    if (!confirmed) return;

    setMembers((previousMembers) =>
      previousMembers.filter((member) => member.id !== Number(selectedMemberId))
    );

    setSelectedMemberId("");
    setActiveAction(null);
    setMessage("🗑️ Team member removed successfully.");

    setTimeout(() => setMessage(""), 4000);
  };

  const handleCancelInvite = (invitationId) => {
    const invitation = invitations.find(
      (currentInvitation) => currentInvitation.id === invitationId
    );

    if (!invitation) return;

    const confirmed = window.confirm(
      `Cancel the invitation sent to ${invitation.name}?`
    );

    if (!confirmed) return;

    setInvitations((previousInvitations) =>
      previousInvitations.filter(
        (currentInvitation) => currentInvitation.id !== invitationId
      )
    );

    setMessage("🗑️ Invitation cancelled successfully.");

    setTimeout(() => setMessage(""), 4000);
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

    setMessage("📨 Invitation reminder sent.");

    setTimeout(() => setMessage(""), 4000);
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
    setInvitationForm({ name: "", email: "", role: "" });
    setErrorMessage("");
  };

  const getInitials = (name) => {
    if (!name) return "TM";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-500 ring-emerald-400";
      case "offline":
        return "bg-slate-300 ring-slate-200";
      default:
        return "bg-slate-300 ring-slate-200";
    }
  };

  const getInvitationStatusColor = (status) => {
    switch (status) {
      case "Waiting":
      case "Pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "Sent":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Reminded":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-6 text-slate-800 dark:text-slate-100 antialiased">
        {/* Header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Team Management
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your team members, roles, invitations, and readiness.
            </p>
          </div>

          <span className="w-fit rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
            <Users className="inline h-3 w-3 mr-1.5" />
            Active Team
          </span>
        </section>

        {/* Messages */}
        {message && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-400 flex items-center gap-2 animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Left Column - Readiness & Actions */}
          <div className="space-y-6 lg:col-span-4">
            {/* Readiness Card */}
            <section className="flex flex-col items-center rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="mb-4 flex w-full items-center justify-between">
                <h2 className="text-xs font-bold tracking-tight text-slate-700 dark:text-slate-300 uppercase">
                  Team Readiness
                </h2>
                <span className="rounded-lg bg-indigo-50 dark:bg-indigo-950/50 p-1.5 text-indigo-600 dark:text-indigo-400">
                  <BarChart3 className="h-4 w-4" />
                </span>
              </div>

              <div className="relative my-3 flex h-32 w-32 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-600 transition-all duration-700 ease-out"
                    strokeDasharray={`${readiness}, 100`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                <div className="absolute text-center">
                  <span className="block text-2xl font-black tracking-tight dark:text-white">
                    {readiness}%
                  </span>
                  <span className="-mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {readiness >= 90 ? "Optimal" : readiness >= 70 ? "Good" : "Needs Work"}
                  </span>
                </div>
              </div>

              <div className="mt-4 w-full space-y-4">
                <div>
                  <div className="mb-1.5 flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span>Skill Coverage</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {skillCoverage}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-700 ease-out"
                      style={{ width: `${skillCoverage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span>Availability</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {availability}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-700 ease-out"
                      style={{ width: `${availability}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRefreshAnalysis}
                disabled={isAnalyzing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-70"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isAnalyzing ? "animate-spin" : ""}`}
                />
                {isAnalyzing ? "Analyzing Team..." : "Refresh Analysis"}
              </button>
            </section>

            {/* Actions Card */}
            <section className="space-y-2 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Team Leader Actions
              </span>

              <button
                type="button"
                onClick={() => openAction("invite")}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-3 text-left transition hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <UserPlus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Send New Invitation
                  </span>
                </div>
                <span className="text-sm text-slate-400 transition group-hover:translate-x-0.5">
                  →
                </span>
              </button>

              <button
                type="button"
                onClick={() => openAction("role")}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-3 text-left transition hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Assign Roles
                  </span>
                </div>
                <span className="text-sm text-slate-400 transition group-hover:translate-x-0.5">
                  →
                </span>
              </button>

              <button
                type="button"
                onClick={() => openAction("remove")}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-3 text-left transition hover:border-rose-200 dark:hover:border-rose-800/50 hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
              >
                <div className="flex items-center gap-3">
                  <UserMinus className="h-4 w-4 text-rose-500" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Remove Member
                  </span>
                </div>
                <span className="text-sm text-slate-400 transition group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </section>

            {/* Action Forms */}
            {activeAction && (
              <section className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm animate-slide-in">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeAction === "invite" && "Send New Invitation"}
                    {activeAction === "role" && "Assign Member Role"}
                    {activeAction === "remove" && "Remove Team Member"}
                  </h2>
                  <button
                    type="button"
                    onClick={closeAction}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Close action form"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {activeAction === "invite" && (
                  <form onSubmit={handleSendInvitation} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          name="name"
                          value={invitationForm.name}
                          onChange={handleInvitationChange}
                          placeholder="Enter the user name"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-slate-800 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Email
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={invitationForm.email}
                          onChange={handleInvitationChange}
                          placeholder="Enter the user email"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-slate-800 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Proposed Role (Optional)
                      </label>
                      <input
                        type="text"
                        name="role"
                        value={invitationForm.role}
                        onChange={handleInvitationChange}
                        placeholder="e.g., Frontend Developer"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-slate-800 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 py-2.5 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Invitation
                        </>
                      )}
                    </button>
                  </form>
                )}

                {activeAction === "role" && (
                  <form onSubmit={handleAssignRole} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Team Member
                      </label>
                      <select
                        value={selectedMemberId}
                        onChange={(event) => setSelectedMemberId(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-slate-800 transition-all"
                      >
                        <option value="">Select a member</option>
                        {members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name} ({member.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                        New Role
                      </label>
                      <input
                        type="text"
                        value={newRole}
                        onChange={(event) => setNewRole(event.target.value)}
                        placeholder="Enter the new role"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-slate-800 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 py-2.5 text-sm font-bold text-white transition-all"
                    >
                      <Briefcase className="h-4 w-4" />
                      Save Role
                    </button>
                  </form>
                )}

                {activeAction === "remove" && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Team Member
                      </label>
                      <select
                        value={selectedMemberId}
                        onChange={(event) => setSelectedMemberId(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:focus:bg-slate-800 transition-all"
                      >
                        <option value="">Select a member</option>
                        {members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveMember}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 py-2.5 text-sm font-bold text-white transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove Member
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right Column - Members & Invitations */}
          <div className="space-y-6 lg:col-span-8">
            {/* Team Members Table */}
            <section className="overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 p-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Current Team Members
                  </h2>
                  <p className="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                    {members.length} contributor{members.length === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="w-fit rounded-lg bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                  Active Project
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <th className="p-3 pl-5">Member</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Specialization</th>
                      <th className="p-3 pr-5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {members.map((member) => (
                      <tr
                        key={member.id}
                        className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                      >
                        <td className="p-3 pl-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50 font-bold text-sm text-indigo-700 dark:text-indigo-400">
                              {getInitials(member.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-bold leading-tight text-slate-900 dark:text-white">
                                {member.name}
                              </p>
                              <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-slate-600 dark:text-slate-300">
                          {member.role}
                        </td>
                        <td className="p-3">
                          <span className="rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/30">
                            {member.specialization}
                          </span>
                        </td>
                        <td className="p-3 pr-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span
                              className={`inline-block h-2.5 w-2.5 rounded-full ${getStatusColor(
                                member.status
                              )} ring-2 ring-offset-1`}
                            />
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 capitalize">
                              {member.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {members.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-5 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                          <Users className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                          No team members found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Pending Invitations */}
            <section className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Pending Invitations
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                    Invitations waiting for a response
                  </p>
                </div>
                <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-400">
                  {invitations.length} outstanding
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {invitations.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                    <Mail className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    No pending invitations.
                  </p>
                ) : (
                  invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex flex-col justify-between gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-400">
                          {getInitials(invitation.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                            {invitation.name}
                          </p>
                          <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                            {invitation.email}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                            {invitation.role} • {invitation.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getInvitationStatusColor(
                            invitation.status
                          )}`}
                        >
                          {invitation.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemindInvite(invitation.id)}
                          className="rounded-lg p-2 text-indigo-600 dark:text-indigo-400 transition hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-800 dark:hover:text-indigo-300"
                          title="Send reminder"
                        >
                          <Send className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancelInvite(invitation.id)}
                          className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-700 dark:hover:text-rose-400"
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
    </div>
  );
}