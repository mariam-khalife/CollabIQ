import React, { useState } from 'react';
import {
  Search,
  HelpCircle,
  Bell,
  Sparkles,
  Brain,
  Users,
  Target,
  Zap,
  Award,
  CheckCircle2,
  X,
  ChevronRight,
  Sliders,
  Filter,
  Clock,
  Briefcase,
  MessageSquare,
  Star,
  TrendingUp,
  Loader2,
} from 'lucide-react';

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
      bio: 'Elena focuses on building efficient large language models and distributed machine learning pipeline architectures at Stanford.',
      rating: 4.9,
      projects: 12,
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
      bio: 'Marcus is a systems infrastructure enthusiast with deep production knowledge of high-throughput cloud cluster automation.',
      rating: 4.7,
      projects: 8,
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
      bio: 'Sarah leads cross-functional alignment initiatives exploring mathematical fairness constraints in deep neural frameworks.',
      rating: 4.8,
      projects: 6,
    }
  ];

  // Filter candidates dynamically based on parameter settings
  const filteredCandidates = initialCandidates.filter(c => c.match >= minMatch);

  // Trigger Toast Alert Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Toggle Invitation Action
  const toggleInvite = (id, name) => {
    if (invitedIds.includes(id)) {
      setInvitedIds(invitedIds.filter(item => item !== id));
      showToast(`Cancelled team invitation for ${name}.`, 'info');
    } else {
      setInvitedIds([...invitedIds, id]);
      showToast(`Successfully sent team invitation to ${name}! 🎉`, 'success');
    }
  };

  const getMatchColor = (match) => {
    if (match >= 90) return 'text-emerald-600 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30';
    if (match >= 80) return 'text-indigo-600 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30';
    if (match >= 70) return 'text-amber-600 border-amber-500 bg-amber-50 dark:bg-amber-950/30';
    return 'text-slate-600 border-slate-400 bg-slate-50 dark:bg-slate-800';
  };

  const getMatchEmoji = (match) => {
    if (match >= 90) return '🌟';
    if (match >= 80) return '✨';
    if (match >= 70) return '💪';
    return '📈';
  };

  return (
    <div className="flex-1 bg-slate-50/50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header Navbar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
            <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Team Matching
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Find the perfect collaborators for your project
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search candidates..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/70 dark:bg-slate-800/70 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </button>

          <button className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              JD
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              John D.
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dynamic Toast Alert Notification */}
        {toast && (
          <div className={`fixed top-20 right-5 z-50 rounded-2xl px-5 py-3 shadow-lg flex items-center gap-3 animate-slide-in max-w-sm ${
            toast.type === 'success' 
              ? 'bg-emerald-600 text-white' 
              : toast.type === 'info' 
              ? 'bg-slate-700 text-white dark:bg-slate-800'
              : 'bg-indigo-600 text-white'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
            {toast.type === 'info' && <X className="w-5 h-5" />}
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        )}

        {/* Top Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/50">
                <Sparkles className="w-3 h-3 inline mr-1" />
                ACTIVE ANALYSIS
              </span>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                {filteredCandidates.length} candidates found
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Recommendations for <span className="text-indigo-600 dark:text-indigo-400">Project: QuantumScribe</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl font-medium leading-relaxed">
              Our matching engine has analyzed 450+ profiles to find candidates that bridge your team's current skill gaps in NLP and distributed systems.
            </p>
          </div>
          
          {/* Toggle Filter Panel Button */}
          <button 
            onClick={() => setIsParamOpen(true)}
            className="flex items-center gap-2 border border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all bg-white dark:bg-slate-900 shadow-sm hover:shadow-md whitespace-nowrap self-start lg:mt-1 text-sm"
          >
            <Sliders className="w-4 h-4" />
            Adjust Parameters
            {minMatch !== 80 && (
              <span className="ml-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-[10px]">
                {minMatch}%+
              </span>
            )}
          </button>
        </div>

        {/* Layout Content Wrapper */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Side: Candidates Cards List */}
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCandidates.length === 0 ? (
              <div className="col-span-2 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center">
                <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                  <Users className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  No candidates meet the minimum match parameter.
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Try lowering the match threshold in the parameters panel.
                </p>
                <button
                  onClick={() => setIsParamOpen(true)}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all"
                >
                  Adjust Parameters
                </button>
              </div>
            ) : (
              filteredCandidates.map((candidate) => {
                const isInvited = invitedIds.includes(candidate.id);
                return (
                  <div 
                    key={candidate.id} 
                    className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[320px]"
                  >
                    <div>
                      {/* Card Head Details */}
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex gap-3">
                          <img 
                            src={candidate.avatar} 
                            alt={candidate.name} 
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700" 
                          />
                          <div>
                            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm leading-tight">
                              {candidate.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-1">
                              {candidate.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                {candidate.rating}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                ({candidate.projects} projects)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-[11px] shrink-0 ${getMatchColor(candidate.match)}`}>
                          {candidate.match}%
                        </div>
                      </div>

                      {/* Skill Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {candidate.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-[9px] font-bold tracking-wide px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="my-4 border-t border-slate-100 dark:border-slate-800"></div>

                      {/* Meta Parameters Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[8px] tracking-wider flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            Experience
                          </p>
                          <p className="text-slate-900 dark:text-white font-extrabold mt-0.5 text-sm">
                            {candidate.experience}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[8px] tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Availability
                          </p>
                          <p className="text-indigo-600 dark:text-indigo-400 font-extrabold mt-0.5 text-sm">
                            {candidate.availability}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reactive Action Interactive Controls */}
                    <div className="grid grid-cols-2 gap-2.5 mt-4">
                      <button 
                        onClick={() => setSelectedCandidate(candidate)}
                        className="border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold py-2.5 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                      >
                        View Profile
                      </button>
                      <button 
                        onClick={() => toggleInvite(candidate.id, candidate.name)}
                        className={`font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm ${
                          isInvited 
                            ? 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50' 
                            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-md hover:shadow-lg'
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
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/30 min-h-[320px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold tracking-tight">AI Skill Analysis</h2>
                  <p className="text-[10px] text-indigo-200 font-medium">Real-time matching insights</p>
                </div>
              </div>
              
              <p className="text-indigo-100/90 text-sm font-medium leading-relaxed">
                Based on your project goals, we've identified that the team lacks a{' '}
                <span className="font-bold text-white underline decoration-wavy decoration-indigo-300">
                  "{targetRole}"
                </span>
                . These suggestions have been weighted to prioritize candidates with cluster alignment.
              </p>
            </div>

            <div className="relative z-10 space-y-4 mt-4 pt-4 border-t border-white/10">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-indigo-200">Project Synergy</span>
                  <span className="text-white">92%</span>
                </div>
                <div className="w-full bg-indigo-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-white h-full rounded-full shadow-sm" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-indigo-200">Skill Coverage</span>
                  <span className="text-white">78%</span>
                </div>
                <div className="w-full bg-indigo-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-white h-full rounded-full shadow-sm" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                <Zap className="w-4 h-4 text-indigo-300" />
                <span className="text-xs font-medium text-indigo-200">
                  {filteredCandidates.length} top candidates found
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* POPUP MODAL Component: View Profile Details */}
      {selectedCandidate && (
        <div 
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCandidate(null);
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200/60 dark:border-slate-800 animate-slide-in">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedCandidate.avatar} 
                  alt={selectedCandidate.name} 
                  className="w-14 h-14 rounded-xl object-cover border-2 border-slate-200 dark:border-slate-700" 
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                    {selectedCandidate.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedCandidate.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {selectedCandidate.rating}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      • {selectedCandidate.projects} projects
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  About
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {selectedCandidate.bio}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Core Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Match Score</p>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    {selectedCandidate.match}%
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Availability</p>
                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {selectedCandidate.availability}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                toggleInvite(selectedCandidate.id, selectedCandidate.name);
                setSelectedCandidate(null);
              }}
              className={`w-full mt-5 font-bold py-3 rounded-xl text-sm transition-all shadow-sm ${
                invitedIds.includes(selectedCandidate.id)
                  ? 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {invitedIds.includes(selectedCandidate.id) 
                ? 'Revoke Team Invitation' 
                : 'Send Fast Track Invitation'}
            </button>
          </div>
        </div>
      )}

      {/* SLIDEOUT SIDEBAR Component: Adjust Engine Parameters */}
      {isParamOpen && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full sm:w-96 h-full shadow-2xl flex flex-col border-l border-slate-200/60 dark:border-slate-800 animate-slide-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
                  <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white">
                    Matching System Tuning
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Refine your search parameters
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsParamOpen(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Parameter 1: Cutoff threshold */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Min AI Confidence Filter
                    </label>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                      {minMatch}%
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="70" 
                    max="95" 
                    step="1" 
                    value={minMatch} 
                    onChange={(e) => setMinMatch(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">
                    <span>70%</span>
                    <span>95%</span>
                  </div>
                </div>

                {/* Parameter 2: Targeted Role Gap */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Target Gap Analysis Role
                  </label>
                  <select 
                    value={targetRole} 
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:bg-slate-800 transition-all text-slate-700 dark:text-slate-200"
                  >
                    <option value="DevOps Specialist">🔧 DevOps Specialist</option>
                    <option value="Data Pipeline Engineer">📊 Data Pipeline Engineer</option>
                    <option value="MLOps Infrastructure Architect">🏗️ MLOps Infrastructure Architect</option>
                  </select>
                </div>

                {/* Current Match Statistics */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Current Results
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Candidates found
                    </span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                      {filteredCandidates.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Average match
                    </span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {filteredCandidates.length > 0 
                        ? Math.round(filteredCandidates.reduce((acc, c) => acc + c.match, 0) / filteredCandidates.length) 
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setIsParamOpen(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Apply System Configurations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}