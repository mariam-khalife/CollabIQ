import React, { useState } from 'react';

export default function AITeamMatching() {
  // State for Toast Notifications
  const [toast, setToast] = useState(null);
  
  // State for tracking invited candidates by ID
  const [invitedIds, setInvitedIds] = useState([]);
  
  // State for View Profile Modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // State for Adjust Parameters Panel
  const [isParamOpen, setIsParamOpen] = useState(false);
  const [minMatch, setMinMatch] = useState(80);
  const [targetRole, setTargetRole] = useState('DevOps Specialist');

  const initialCandidates = [
    {
      id: 1,
      name: 'Elena Vance',
      title: 'PhD Candidate • Stanford University',
      match: 94,
      avatar: 'https://plus.unsplash.com/premium_photo-1689551671541-31a345ce6ae0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww',
     
      tags: ['NATURAL LANGUAGE PROCESSING', 'PYTORCH', 'DATA ARCHITECTURE'],
      experience: '6+ Years',
      availability: 'Immediate',
      bio: 'Elena focuses on building efficient large language models and distributed machine learning pipeline architectures at Stanford.'
    },
    {
      id: 2,
      name: 'Marcus Chen',
      title: 'Senior Developer • MIT',
      match: 88,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww',
      tags: ['DISTRIBUTED SYSTEMS', 'GO', 'KUBERNETES'],
      experience: '4+ Years',
      availability: '2 Weeks',
      bio: 'Marcus is a systems infrastructure enthusiast with deep production knowledge of high-throughput cloud cluster automation.'
    },
    {
      id: 3,
      name: 'Sarah Jenkins',
      title: 'Masters Student • ETH Zurich',
      match: 82,
      avatar: 'https://media.istockphoto.com/id/1092821522/photo/portrait-of-a-young-beautiful-well-dressed-business-woman.jpg?s=1024x1024&w=is&k=20&c=FuH0g_9l029H8bFRZZqkQtTMCnprcS6xtN-xV1YBlX8=',
      
      tags: ['AI ETHICS', 'RESEARCH', 'PYTHON'],
      experience: '2+ Years',
      availability: 'Immediate',
      bio: 'Sarah leads cross-functional alignment initiatives exploring mathematical fairness constraints in deep neural frameworks.'
    }
  ];

  // Filter candidates dynamically based on parameter settings
  const filteredCandidates = initialCandidates.filter(c => c.match >= minMatch);

  // Trigger Toast Alert Helper
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle Invitation Action
  const toggleInvite = (id, name) => {
    if (invitedIds.includes(id)) {
      setInvitedIds(invitedIds.filter(item => item !== id));
      showToast(`Cancelled team invitation for ${name}.`);
    } else {
      setInvitedIds([...invitedIds, id]);
      showToast(`Successfully sent team invitation to ${name}!`);
    }
  };

  return (
    <div className="w-full text-slate-800 antialiased p-1 max-w-[1250px] mx-auto relative">
      
      {/* Dynamic Toast Alert Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <span>✨</span> {toast}
        </div>
      )}

      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-5">
        <div className="space-y-1">
          <span className="inline-block bg-[#EEF2FF] text-[#4F46E5] text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
            ACTIVE ANALYSIS
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            AI Recommendations for <span className="text-[#4F46E5]">Project: QuantumScribe</span>
          </h1>
          <p className="text-slate-500 text-[11px] max-w-3xl font-normal leading-relaxed">
            Our matching engine has analyzed 450+ profiles to find candidates that bridge your team's current skill gaps in NLP and distributed systems.
          </p>
        </div>
        
        {/* Toggle Filter Panel Button */}
        <button 
          onClick={() => setIsParamOpen(true)}
          className="flex items-center gap-1.5 border border-indigo-100 text-[#4F46E5] font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-50/50 transition text-[11px] bg-white shadow-sm whitespace-nowrap self-start lg:mt-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Adjust Parameters {minMatch !== 80 && `(${minMatch}%+)`}
        </button>
      </div>

      {/* Layout Content Wrapper */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        
        {/* Left Side: Candidates Cards List */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCandidates.length === 0 ? (
            <div className="col-span-2 bg-white border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs font-medium">
              No candidates meet the minimum match parameter threshold. Try lowering it!
            </div>
          ) : (
            filteredCandidates.map((candidate) => {
              const isInvited = invitedIds.includes(candidate.id);
              return (
                <div key={candidate.id} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex flex-col justify-between min-h-[290px] transition hover:border-slate-200">
                  <div>
                    {/* Card Head Details */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex gap-2.5">
                        <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-lg object-cover bg-slate-50" />
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">{candidate.name}</h3>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{candidate.title}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-[#4F46E5] flex items-center justify-center text-[#4F46E5] font-black text-[10px] bg-[#EEF2FF]/50 shrink-0">
                        {candidate.match}%
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {candidate.tags.map((tag, i) => (
                        <span key={i} className="bg-[#EEF2FF]/60 text-[#4F46E5] text-[8.5px] font-bold tracking-wide px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="my-3 border-t border-slate-100"></div>

                    {/* Meta Parameters Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider">Experience</p>
                        <p className="text-slate-900 font-extrabold mt-0.5 text-xs">{candidate.experience}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider">Availability</p>
                        <p className="text-[#4F46E5] font-extrabold mt-0.5 text-xs">{candidate.availability}</p>
                      </div>
                    </div>
                  </div>

                  {/* Reactive Action Interactive Controls */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button 
                      onClick={() => setSelectedCandidate(candidate)}
                      className="border border-slate-200 text-slate-600 font-bold py-1.5 rounded-lg text-[11px] hover:bg-slate-50 transition shadow-sm"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => toggleInvite(candidate.id, candidate.name)}
                      className={`font-bold py-1.5 rounded-lg text-[11px] transition shadow-sm ${
                        isInvited 
                          ? 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100' 
                          : 'bg-[#4F46E5] hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isInvited ? 'Cancel Invite' : 'Invite Member'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Dynamic AI Skill Analysis Card */}
        <div className="bg-[#4F46E5] rounded-xl p-4 text-white shadow-md min-h-[290px] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-white/10 rounded-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-sm font-bold tracking-tight">AI Skill Analysis</h2>
            </div>
            <p className="text-indigo-100/90 text-[11px] font-normal leading-relaxed">
              Based on your project goals, we've identified that the team lacks a <span className="font-bold text-white underline decoration-wavy decoration-indigo-300">"{targetRole}."</span> These suggestions have been weighted to prioritize candidates with cluster alignment.
            </p>
          </div>

          <div className="space-y-3 mt-4 pt-3 border-t border-white/10">
            <div>
              <div className="flex justify-between text-[10px] font-bold mb-0.5">
                <span>Project Synergy</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-indigo-700 rounded-full h-1">
                <div className="bg-white h-1 rounded-full shadow-sm" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold mb-0.5">
                <span>Skill Coverage</span>
                <span>78%</span>
              </div>
              <div className="w-full bg-indigo-700 rounded-full h-1">
                <div className="bg-white h-1 rounded-full shadow-sm" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* POPUP MODAL Component: View Profile Details */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 relative border border-slate-100">
            <button 
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <img src={selectedCandidate.avatar} alt={selectedCandidate.name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{selectedCandidate.name}</h3>
                <p className="text-xs text-slate-500">{selectedCandidate.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
              {selectedCandidate.bio}
            </p>

            <div className="space-y-2 mb-5">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">Verified Core Skills</span>
              <div className="flex flex-wrap gap-1">
                {selectedCandidate.tags.map((tag, i) => (
                  <span key={i} className="bg-slate-100 text-slate-700 text-[9px] font-semibold px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                toggleInvite(selectedCandidate.id, selectedCandidate.name);
                setSelectedCandidate(null);
              }}
              className="w-full bg-[#4F46E5] text-white font-bold py-2 rounded-xl text-xs hover:bg-indigo-700 transition shadow-sm"
            >
              {invitedIds.includes(selectedCandidate.id) ? 'Revoke Team Invitation' : 'Send Fast Track Invitation'}
            </button>
          </div>
        </div>
      )}

      {/* SLIDEOUT SIDEBAR Component: Adjust Engine Parameters */}
      {isParamOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white w-80 h-full p-5 shadow-2xl flex flex-col justify-between border-l border-slate-100 animate-slideLeft">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-slate-900 text-sm">Matching System Tuning</h3>
                <button onClick={() => setIsParamOpen(false)} className="text-slate-400 text-xs font-bold hover:text-slate-600">✕ Close</button>
              </div>

              <div className="space-y-5">
                {/* Parameter 1: Cutoff threshold */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Min AI Confidence Filter ({minMatch}%)</label>
                  <input 
                    type="range" min="70" max="95" step="1" 
                    value={minMatch} 
                    onChange={(e) => setMinMatch(Number(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Parameter 2: Targeted Role Gap */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Target Gap Analysis Role</label>
                  <select 
                    value={targetRole} 
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:outline-indigo-500"
                  >
                    <option value="DevOps Specialist">DevOps Specialist</option>
                    <option value="Data Pipeline Engineer">Data Pipeline Engineer</option>
                    <option value="MLOps Infrastructure Architect">MLOps Infrastructure Architect</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsParamOpen(false)}
              className="w-full bg-[#4F46E5] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition"
            >
              Apply System Configurations
            </button>
          </div>
        </div>
      )}

    </div>
  );
}