import React, { useState } from 'react';

export default function TeamManagement() {
  // State for interactive features
  const [readiness, setReadiness] = useState(85);
  const [skillCoverage, setSkillCoverage] = useState(92);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [members, setMembers] = useState([
    { id: 1, name: 'Elena Vance', email: 'elena.v@university.edu', role: 'Lead Researcher', specialization: 'Quantum Computing', status: 'active' },
    { id: 2, name: 'Marcus Thorne', email: 'm.thorne@collabiq.io', role: 'Data Architect', specialization: 'Python/R', status: 'active' },
    { id: 3, name: 'Priya Sharma', email: 'p.sharma@research.org', role: 'UI/UX Designer', specialization: 'Figma/Design Ops', status: 'offline' }
  ]);

  const [invitations, setInvitations] = useState([
    { id: 1, name: 'Jordan Hayes', status: 'Waiting', time: 'Sent 2 days ago' },
    { id: 2, name: 'Sarah Connor', status: 'Sent', time: 'Status: Delivered' }
  ]);

  // Interaction: Refresh AI Analysis
  const handleRefreshAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setReadiness(Math.floor(Math.random() * (95 - 80 + 1)) + 80);
      setSkillCoverage(Math.floor(Math.random() * (98 - 88 + 1)) + 88);
      setIsAnalyzing(false);
    }, 1000);
  };

  // Interaction: Cancel Invitation
  const handleCancelInvite = (id) => {
    setInvitations(invitations.filter(invite => invite.id !== id));
  };

  // Interaction: Remind Invitation
  const handleRemindInvite = (name) => {
    alert(`Reminder notification re-sent to ${name}`);
  };

  return (
    <div className="w-full text-slate-800 antialiased p-1 max-w-[1250px] mx-auto">
      
      {/* Page Title Dashboard header context is handled by parent Topbar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        
        {/* LEFT COLUMN: TEAM READINESS & ACTIONS */}
        <div className="space-y-4">
          
          {/* Card 1: Team Readiness Metric */}
          <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-center flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">Team Readiness</h3>
              <span className="text-indigo-600 bg-indigo-50 p-1 rounded-md text-xs">📊</span>
            </div>

            {/* Circular Gauge Meter */}
            <div className="relative w-28 h-28 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-indigo-600 transition-all duration-500" strokeDasharray={`${readiness}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black block tracking-tight">{readiness}%</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block -mt-1">Ready</span>
              </div>
            </div>

            {/* Micro Progress Bars */}
            <div className="w-full space-y-2.5 mt-4 text-left">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                  <span>Skill Coverage</span>
                  <span className="text-indigo-600">{skillCoverage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1">
                  <div className="bg-indigo-600 h-1 rounded-full transition-all duration-500" style={{ width: `${skillCoverage}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                  <span>Availability</span>
                  <span className="text-indigo-600">78%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1">
                  <div className="bg-indigo-600 h-1 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleRefreshAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-[#4F46E5] hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2 rounded-lg text-[11px] mt-5 transition shadow-sm"
            >
              {isAnalyzing ? 'Analyzing System...' : 'Refresh AI Analysis'}
            </button>
          </div>

          {/* Card 2: Team Leader Management Quick Actions */}
          <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm space-y-2.5">
            <span className="text-[8.5px] font-bold text-slate-400 tracking-wider uppercase block mb-1">Team Leader Actions</span>
            
            <button className="w-full flex items-center justify-between border border-slate-100 hover:border-slate-200 p-2.5 rounded-lg text-left transition bg-slate-50/50 hover:bg-slate-50 group">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">👥</span>
                <span className="text-xs font-bold text-slate-700">Send New Invitation</span>
              </div>
              <span className="text-slate-400 group-hover:translate-x-0.5 transition text-xs">➔</span>
            </button>

            <button className="w-full flex items-center justify-between border border-slate-100 hover:border-slate-200 p-2.5 rounded-lg text-left transition bg-slate-50/50 hover:bg-slate-50 group">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">💼</span>
                <span className="text-xs font-bold text-slate-700">Assign Roles</span>
              </div>
              <span className="text-slate-400 group-hover:translate-x-0.5 transition text-xs">➔</span>
            </button>

            <button className="w-full flex items-center justify-between border border-slate-100 hover:border-slate-200 p-2.5 rounded-lg text-left transition bg-slate-50/50 hover:bg-slate-50 group">
              <div className="flex items-center gap-2">
                <span className="text-rose-500 text-xs">👤</span>
                <span className="text-xs font-bold text-slate-700">Remove Member</span>
              </div>
              <span className="text-slate-400 group-hover:translate-x-0.5 transition text-xs">➔</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMNS: TEAM LIST & PENDING INVITATIONS */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Section A: Current Team Members Table */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Current Team Members</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{members.length} active contributors found</p>
              </div>
              <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Active Project
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/10">
                    <th className="p-3 pl-4">Member</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Specialization</th>
                    <th className="p-3 pr-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/40 transition">
                      {/* Name Card */}
                      <td className="p-3 pl-4 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 font-bold text-slate-700 flex items-center justify-center border border-slate-200 uppercase shrink-0">
                          {member.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{member.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal mt-0.5">{member.email}</p>
                        </div>
                      </td>
                      {/* Role text */}
                      <td className="p-3 text-slate-600 font-medium">{member.role}</td>
                      {/* Custom pill specialized */}
                      <td className="p-3">
                        <span className="bg-indigo-50/60 text-indigo-600 text-[10px] font-semibold px-2 py-0.5 rounded">
                          {member.specialization}
                        </span>
                      </td>
                      {/* Active green/grey indicator bar dot */}
                      <td className="p-3 pr-4 text-center">
                        <span className={`inline-block w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B: Outstanding Invitations Stack */}
          <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Pending Invitations</h3>
              <span className="text-[11px] text-slate-400 font-medium">{invitations.length} outstanding</span>
            </div>

            <div className="divide-y divide-slate-50">
              {invitations.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No pending invitations outstanding.</p>
              ) : (
                invitations.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs">
                        @
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{invite.name}</p>
                        <p className="text-[10px] text-slate-400">{invite.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-slate-100 text-slate-600 font-bold text-[9px] px-2 py-0.5 rounded">
                        {invite.status}
                      </span>
                      {/* Resend Action SVG */}
                      <button 
                        onClick={() => handleRemindInvite(invite.name)}
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50 transition"
                        title="Resend Invitation Notification"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                      {/* Cancel Action SVG */}
                      <button 
                        onClick={() => handleCancelInvite(invite.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition"
                        title="Revoke Invitation"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}