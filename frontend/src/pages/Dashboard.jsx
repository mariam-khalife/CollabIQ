import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';
import {
  LayoutDashboard, User, Users, Cpu, Group, 
  Lightbulb, FolderGit2, Bell, Award, Settings,
  Search, HelpCircle, Plus, Calendar, Eye, 
  FileText, CheckCircle2, MessageSquare
} from 'lucide-react';

export default function AcademicDashboard() {
  // 1. Interactive States
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState(78);
  const [readiness, setReadiness] = useState(92);
  const [reputation, setReputation] = useState(842);

  // 2. Dynamic Data States
  const [teamMembers, setTeamMembers] = useState([
    {
      name: "Liam Vance",
      role: "Data Scientist",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    },
    {
      name: "Elena Rossi",
      role: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=500&auto=format&fit=crop&q=60",
    },
    {
      name: "Marcus Thorne",
      role: "AI Engineer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60",
    },
  ]);

  const [deadlines, setDeadlines] = useState([
    { id: 1, month: "Oct", day: "24", title: "Data Set Submission", location: "Research Hall", status: "Due in 2 days" },
    { id: 2, month: "Oct", day: "28", title: "UI Wireframe Review", location: "Zoom", status: "Weekly Sync" },
    { id: 3, month: "Nov", day: "02", title: "Academic Poster Draft", location: "Submission Portal", status: "Open" }
  ]);

  const [activities, setActivities] = useState([
    { id: 1, user: "Liam Vance", action: "uploaded", target: "Research_Paper_v2.pdf", time: "14 minutes ago", type: "file" },
    { id: 2, user: "System", action: "automatically matched your project with", target: "3 Potential Mentors", time: "2 hours ago", type: "system" },
    { id: 3, user: "Elena Rossi", action: "started a new discussion thread:", target: '"Typography choices for the final presentation"', time: "4 hours ago", type: "chat" }
  ]);

  // 3. Action Handlers
  const handleInviteCollaborator = () => {
    const name = prompt("Enter collaborator's name:");
    const role = prompt("Enter collaborator's role (e.g., Frontend Developer):");
    
    if (name && role) {
      const newMember = {
        name,
        role,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
      };
      setTeamMembers([...teamMembers, newMember]);
      logActivity(name, "joined the team as", role, "Just now", "system");
      setReadiness(prev => Math.min(prev + 3, 100));
    }
  };

  const logActivity = (user, action, target, time, type) => {
    const newActivity = { id: Date.now(), user, action, target, time, type };
    setActivities([newActivity, ...activities]);
  };

  const handleCompleteDeadline = (id, title) => {
    // Remove the completed deadline from the list
    const remainingDeadlines = deadlines.filter(d => d.id !== id);
    setDeadlines(remainingDeadlines);
    
    // Log activity and boost metrics
    logActivity("Sarah Chen", "completed the task:", title, "Just now", "file");
    setReputation(prev => Math.min(prev + 15, 1000));
    
    // Corrected Step Logic: Hits exactly 100% on final clearance
    if (remainingDeadlines.length === 2) {
      setProgress(85);
    } else if (remainingDeadlines.length === 1) {
      setProgress(93);
    } else if (remainingDeadlines.length === 0) {
      setProgress(100); // 100% finished!
    }
  };

  // 4. Search Filter Logic
  const filteredTeam = teamMembers.filter(member => 
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      
      {/* MAIN CONTENT WINDOW */}
      <main className="flex-1 flex flex-col relative min-w-0 h-screen overflow-hidden">
        
        {/* CONTAINER VIEWPORTS */}
        <div className="p-8 space-y-6 overflow-y-auto flex-1">
          
          {/* CONTENT TITLE SECTION */}
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Dashboard</h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Welcome back, Sarah. Your team is currently <span className="text-emerald-600 font-bold italic">Top Ranked</span> this semester.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search team..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm text-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => alert("Opening Project Workspace...")}
                  className="border border-indigo-200 text-indigo-600 text-xs font-semibold px-4 py-2.5 rounded-xl bg-white hover:bg-indigo-50/50 transition-colors"
                >
                  View Project
                </button>
                <button 
                  onClick={handleInviteCollaborator}
                  className="bg-[#312E81] text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-900 transition-colors"
                >
                  Build Team
                </button>
              </div>
            </div>
          </div>

          {/* ROW 1: ACTIVE RESEARCH GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Active Research Card */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">    
                    Active Research
                  </span>
                  <div className="text-indigo-500"><Cpu size={20} className="stroke-[1.5]"/></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-4 leading-snug">
                  AI-Driven Neural Pattern Recognition
                </h3>
                
                {/* Progress Tracking */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Overall Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Card Meta Stats Footer */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Milestone</p>
                  <p className="font-bold text-slate-800 mt-0.5">{progress >= 100 ? "Finished 🎉" : "Phase 3: Testing"}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Priority</p>
                  <p className="font-bold text-rose-600 mt-0.5">High</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Lead</p>
                  <p className="font-bold text-slate-800 mt-0.5">Dr. Sarah Chen</p>
                </div>
              </div>
            </div>

            {/* The Synapse Team Card */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400">The Synapse Team</h4>
                <div className="space-y-3.5 mt-4 max-h-[160px] overflow-y-auto pr-1">
                  {filteredTeam.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <img src={member.image} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">{member.name}</h5>
                        <p className="text-[10px] text-slate-400 font-medium">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  {filteredTeam.length === 0 && (
                    <p className="text-[11px] text-slate-400 italic">No members match search.</p>
                  )}
                </div>
              </div>
              <button 
                onClick={handleInviteCollaborator}
                className="w-full mt-4 border border-dashed border-slate-300 hover:bg-slate-50 transition-colors text-[11px] font-bold text-slate-500 py-2 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Plus size={12} /> Invite Collaborator
              </button>
            </div>

            {/* Team Readiness Card */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-between text-center">
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 self-start">Team Readiness</h4>
              
              <div 
                className="relative w-28 h-28 flex items-center justify-center mt-2 cursor-pointer group"
                onClick={() => setReadiness(prev => (prev >= 100 ? 70 : prev + 2))}
              >
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="2.5" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-indigo-600 transition-all duration-500" strokeDasharray={`${readiness}, 100`} strokeWidth="2.5" strokeLinecap="round" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-800">{readiness}</span>
                  <span className="text-[10px] font-medium text-slate-400 -mt-1">{readiness > 90 ? "Optimal" : "Stable"}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-normal max-w-[180px] mt-2">
                {readiness > 90 ? (
                  <span>AI suggests your team is ready for the <span className="text-indigo-600 font-bold">Final Peer Review.</span></span>
                ) : (
                  <span>Gathering more resources to optimize your review roadmap.</span>
                )}
              </p>
            </div>

          </div>

          {/* ROW 2: SPLIT LAYOUT FOR EVENTS & METRICS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Upcoming Deadlines Box */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Upcoming Deadlines</h4>
                <Calendar size={16} className="text-slate-400" />
              </div>
              
              <div className="space-y-4">
                {deadlines.map((deadline) => (
                  <div key={deadline.id} className="flex gap-3 items-start justify-between group">
                    <div className="flex gap-3 items-start">
                      <div className={`flex flex-col items-center justify-center p-2 rounded-xl text-center shrink-0 min-w-[48px] ${
                        deadline.month === 'Oct' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        <span className="text-[9px] font-bold uppercase tracking-wider">{deadline.month}</span>
                        <span className="text-base font-bold leading-none mt-0.5">{deadline.day}</span>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">{deadline.title}</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">{deadline.status} • {deadline.location}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCompleteDeadline(deadline.id, deadline.title)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-600 transition-all p-1"
                      title="Mark complete"
                    >
                      <CheckCircle2 size={14} />
                    </button>
                  </div>
                ))}
                {deadlines.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-4">All deadlines resolved! 🎉</p>
                )}
              </div>
            </div>

            {/* Recent Activity Box */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Recent Activity</h4>
                <button 
                  onClick={() => setActivities([])} 
                  className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Clear Logs
                </button>
              </div>

              <div className="space-y-4 max-h-[180px] overflow-y-auto pr-1">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 items-start">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      activity.type === 'file' ? 'bg-indigo-50 text-indigo-600' :
                      activity.type === 'system' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#EEF2FF] text-indigo-500'
                    }`}>
                      {activity.type === 'file' && <FileText size={14} />}
                      {activity.type === 'system' && <CheckCircle2 size={14} />}
                      {activity.type === 'chat' && <MessageSquare size={14} />}
                    </div>
                    <div className="text-xs leading-normal">
                      <span className="font-bold text-slate-800">{activity.user}</span> {activity.action}{' '}
                      <span className="text-indigo-600 font-bold underline cursor-pointer">{activity.target}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-4">No recent history.</p>
                )}
              </div>
            </div>

            {/* Reputation Score Box */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Reputation Score</h4>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-800 tracking-tight">{reputation}</span>
                  <span className="text-xs text-slate-400 font-medium">/ 1000</span>
                </div>

                <div className="flex items-start gap-3 mt-4 bg-[#F8FAFC] p-3 rounded-xl border border-slate-100">
                  <div className="p-2 bg-indigo-600 rounded-xl text-white shrink-0 shadow-sm"><Award size={16} /></div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Elite Contributor</h5>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Top 5% in Computer Science</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium mt-4">
                <span>Performance Indicator</span>
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <span className="text-[12px] font-normal">↗</span> High
                </span>
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}