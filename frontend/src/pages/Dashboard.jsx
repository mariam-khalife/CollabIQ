import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';
import {
  LayoutDashboard, User, Users, Cpu, Group, 
  Lightbulb, FolderGit2, Bell, Award, Settings,
  Search, HelpCircle, Plus, Calendar, Eye, 
  FileText, CheckCircle2, MessageSquare
} from 'lucide-react';

export default function AcademicDashboard() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Logo Area */}
          <div>
            <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-1">
              CollabIQ
            </h1>
            <p className="text-[11px] font-medium text-slate-400 tracking-wider mt-0.5">
              Academic Excellence
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[14px] font-semibold rounded-xl bg-[#EEF2FF] text-[#4f46E5]">
              <LayoutDashboard size={18}/> Dashboard </Link>
            
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
              <User size={18} /> My Profile
            </Link>
            <Link to="/build-team" className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
              <Plus size={18} /> Build New Team
            </Link>
            <Link to="/ai-matching" className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
              <Cpu size={18} /> AI Team Matching
            </Link>
            <Link to="/team-management" className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
              <Users size={18} /> Team Management
            </Link>
            <Link to="/ai-suggestions" className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
              <Lightbulb size={18} /> AI Project Suggestions
            </Link>
            <Link to="/my-projects" className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
              <FolderGit2 size={18} /> My Project
            </Link>
            <Link to="/notifications" className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
              <Bell size={18} /> Notifications
            </Link>
            <Link to="/reputation" className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
              <Award size={18} /> Reputation
            </Link>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
              <Settings size={18} /> Settings
            </Link>
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60"
            alt="Ibrahim Sherri" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-800">Alex Rivera</h4>
            <p className="text-xs text-slate-400">Computer Science</p>
          </div>
        </div>
      </aside>
      
      {/* MAIN CONTENT WINDOW */}
      <main className="flex-1 flex flex-col relative min-w-0 h-screen overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0">
          {/* Search Box */}
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search projects, teams, or research..."
              className="w-full bg-[#F1F5F9] pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-600 placeholder-slate-400"
            />
          </div>
          {/* Action Row */}
          <div className="flex items-center gap-4">
            <button className="relative p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <button className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg">
              <HelpCircle size={20} />
            </button>
            <div className="h-5 w-px bg-slate-200 mx-1"></div>
            <button className="bg-[#312E81] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-indigo-900 transition-colors">
              + New Team
            </button>
          </div>
        </header>

        {/* CONTAINER VIEWPORTS */}
        <div className="p-8 space-y-6 overflow-y-auto flex-1">
          
          {/* CONTENT TITLE SECTION */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Dashboard</h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Welcome back, Sarah. Your team is currently <span className="text-emerald-600 font-bold italic">Top Ranked</span> this semester.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="border border-indigo-200 text-indigo-600 text-xs font-semibold px-4 py-2.5 rounded-xl bg-white hover:bg-indigo-50/50 transition-colors">
                View Project
              </button>
              <button className="bg-[#312E81] text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-900 transition-colors">
                Build Team
              </button>
            </div>
          </div>

          {/* ROW 1: ACTIVE RESEARCH GRID  */}
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
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full w-[78%]"></div>
                  </div>
                </div>
              </div>
              {/* Card Meta Stats Footer */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Milestone</p>
                  <p className="font-bold text-slate-800 mt-0.5">Phase 3: Testing</p>
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
                <div className="space-y-3.5 mt-4">
                  {/* Member Node */}
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80" alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Liam Vance</h5>
                      <p className="text-[10px] text-slate-400 font-medium">Data Scientist</p>
                    </div>
                  </div>
                  {/* Member Node */}
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=500&auto=format&fit=crop&q=60" alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Elena Rossi</h5>
                      <p className="text-[10px] text-slate-400 font-medium">UI/UX Designer</p>
                    </div>
                  </div>
                  {/* Member Node */}
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60" alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Marcus Thorne</h5>
                      <p className="text-[10px] text-slate-400 font-medium">AI Engineer</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 border border-dashed border-slate-300 hover:bg-slate-50 transition-colors text-[11px] font-bold text-slate-500 py-2 rounded-xl flex items-center justify-center gap-1.5">
                <Plus size={12} /> Invite Collaborator
              </button>
            </div>

            {/* Team Readiness Card */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-between text-center">
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 self-start">Team Readiness</h4>
              
              {/* Radial Dial Simulation */}
              <div className="relative w-28 h-28 flex items-center justify-center mt-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="2.5" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-indigo-600" strokeDasharray="92, 100" strokeWidth="2.5" strokeLinecap="round" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-800">92</span>
                  <span className="text-[10px] font-medium text-slate-400 -mt-1">Optimal</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-normal max-w-[180px] mt-2">
                AI suggests your team is ready for the <span className="text-indigo-600 font-bold">Final Peer Review.</span>
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
                {/* Deadline item */}
                <div className="flex gap-3 items-start">
                  <div className="bg-rose-50 text-rose-600 flex flex-col items-center justify-center p-2 rounded-xl text-center shrink-0 min-w-[48px]">
                    <span className="text-[9px] font-bold uppercase tracking-wider">Oct</span>
                    <span className="text-base font-bold leading-none mt-0.5">24</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Data Set Submission</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Due in 2 days • Research Hall</p>
                  </div>
                </div>
                {/* Deadline item */}
                <div className="flex gap-3 items-start">
                  <div className="bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center p-2 rounded-xl text-center shrink-0 min-w-[48px]">
                    <span className="text-[9px] font-bold uppercase tracking-wider">Oct</span>
                    <span className="text-base font-bold leading-none mt-0.5">28</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">UI Wireframe Review</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Weekly Sync • Zoom</p>
                  </div>
                </div>
                {/* Deadline item */}
                <div className="flex gap-3 items-start">
                  <div className="bg-blue-50 text-blue-600 flex flex-col items-center justify-center p-2 rounded-xl text-center shrink-0 min-w-[48px]">
                    <span className="text-[9px] font-bold uppercase tracking-wider">Nov</span>
                    <span className="text-base font-bold leading-none mt-0.5">02</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Academic Poster Draft</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Submission Portal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Box */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Recent Activity</h4>
                <a href="#" className="text-[11px] font-bold text-indigo-600 hover:underline">View All</a>
              </div>

              <div className="space-y-4">
                {/* Activity node */}
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 shrink-0"><FileText size={14} /></div>
                  <div className="text-xs leading-normal">
                    <span className="font-bold text-slate-800">Liam Vance</span> uploaded <span className="text-indigo-600 font-bold underline cursor-pointer">Research_Paper_v2.pdf</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">14 minutes ago</p>
                  </div>
                </div>
                {/* Activity node */}
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 shrink-0"><CheckCircle2 size={14} /></div>
                  <div className="text-xs leading-normal">
                    <span className="font-bold text-slate-800">System</span> automatically matched your project with <span className="text-indigo-600 font-bold cursor-pointer">3 Potential Mentors</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">2 hours ago</p>
                  </div>
                </div>
                {/* Activity node */}
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 bg-[#EEF2FF] rounded-lg text-indigo-500 shrink-0"><MessageSquare size={14} /></div>
                  <div className="text-xs leading-normal">
                    <span className="font-bold text-slate-800">Elena Rossi</span> started a new discussion thread: <span className="italic text-slate-600 font-medium">"Typography choices for the final presentation"</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">4 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reputation Score Box */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Reputation Score</h4>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-800 tracking-tight">842</span>
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
                <span>Last Week</span>
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <span className="text-[12px] font-normal">↗</span> +48 pts
                </span>
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}