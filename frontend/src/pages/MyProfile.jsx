import React, { useState } from 'react';

export default function Profile() {
  // =========================================================================
  // INTERACTIVE STATES
  // =========================================================================
  const [profileData, setProfileData] = useState({
    fullName: "Alexander Sterling",
    email: "a.sterling@stanford.edu",
    institution: "Stanford University - Graduate School of Engineering"
  });

  const [skills, setSkills] = useState([
    'Machine Learning', 'UI/UX Design', 'Python (Advanced)', 'Statistical Modeling', 'Project Management'
  ]);

  const [interests, setInterests] = useState([
    'Neural Networks', 'Ethical AI', 'Human-Computer Interaction'
  ]);

  const [collaboration, setCollaboration] = useState({
    experienceLevel: "Advanced Graduate Student",
   
    weeklyHours: 16 // Ties dynamically to the UI progress bar (out of 24 max hours)
  });

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Quantum NLP Framework",
      description: "A collaborative research paper on quantum linguistic patterns in...",
      status: "Completed",
      meta: "★ 5.0",
      role: "Lead Author"
    },
    {
      id: 2,
      title: "Smart Campus Ecosystem",
      description: "IoT infrastructure design for sustainable resource management...",
      status: "Active",
      meta: "👥 4 People",
      role: "System Architect"
    }
  ]);

  // =========================================================================
  // ACTION HANDLERS
  // =========================================================================
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    const newSkill = prompt("Enter a new core skill:");
    if (newSkill && newSkill.trim() !== "" && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill.trim()]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddInterest = () => {
    const newInterest = prompt("Enter a new research interest:");
    if (newInterest && newInterest.trim() !== "" && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest.trim()]);
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const handleAddProject = () => {
    const title = prompt("Enter Project Title:");
    if (!title) return;
    const description = prompt("Enter brief project description:");
    const status = confirm("Is this project complete? (Click Cancel for Active)") ? "Completed" : "Active";
    const role = prompt("What was your role? (e.g., Lead Developer):") || "Contributor";

    const newProj = {
      id: Date.now(),
      title,
      description: description || "No description provided.",
      status,
      meta: status === "Completed" ? "★ 5.0" : "👥 1 Person",
      role
    };

    setProjects([...projects, newProj]);
  };

  const handleSaveChanges = () => {
    alert(
      `🎉 Changes Saved Successfully!\n\n` +
      `Name: ${profileData.fullName}\n` +
      `Role: ${collaboration.preferredRole}\n` +
      `Total Skills: ${skills.length}\n` +
      `Total Projects: ${projects.length}`
    );
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 text-[#1E293B]">
      
      {/* =========================================================================
          HEADER SECTION
         ========================================================================= */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your academic identity and team matching preferences.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert("Editing mode initialized. Simply type inside the input forms below.")}
            className="px-5 py-2 border border-indigo-200 text-indigo-600 rounded-lg font-semibold bg-white hover:bg-indigo-50 transition text-sm"
          >
            Edit Profile
          </button>
          <button 
            onClick={handleSaveChanges}
            className="px-5 py-2 bg-[#4338CA] text-white rounded-lg font-semibold shadow-sm hover:bg-indigo-800 transition text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN CONTENT GRID
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Profile info & Skills */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PROFILE CARD */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="relative group flex-shrink-0 mx-auto md:mx-0">
              <img 
                src="https://images.unsplash.com/photo-1654110455429-cf322b40a906?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww" 
                alt="Profile Avatar" 
                className="w-28 h-28 rounded-xl object-cover border border-slate-100"
              />
              <button 
                onClick={() => alert("Avatar upload framework initialized.")}
                className="absolute bottom-1 right-1 bg-indigo-600 text-white p-1.5 rounded-lg shadow hover:bg-indigo-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={profileData.fullName} 
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-indigo-600" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">University Email</label>
                <input 
                  type="email" 
                  value={profileData.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-indigo-600" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Current Institution</label>
                <input 
                  type="text" 
                  value={profileData.institution} 
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-indigo-600" 
                />
              </div>
            </div>
          </div>

          {/* SKILLS & INTERESTS CARD */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            {/* Core Skills */}
            <div>
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                Core Skills (Click to delete)
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill} 
                    onClick={() => handleRemoveSkill(skill)}
                    className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-xs font-semibold cursor-pointer hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
                    title="Click to remove"
                  >
                    {skill} &times;
                  </span>
                ))}
                <button 
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 border border-dashed border-slate-300 hover:border-indigo-500 rounded-full text-xs text-slate-500 flex items-center gap-1 transition"
                >
                  + Add Skill
                </button>
              </div>
            </div>

            {/* Research Interests */}
            <div>
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Research Interests (Click to delete)
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span 
                    key={interest} 
                    onClick={() => handleRemoveInterest(interest)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-semibold cursor-pointer hover:bg-rose-600 transition"
                    title="Click to remove"
                  >
                    {interest} &times;
                  </span>
                ))}
                <button 
                  onClick={handleAddInterest}
                  className="px-3 py-1.5 border border-dashed border-slate-300 hover:border-indigo-500 rounded-full text-xs text-slate-500 flex items-center gap-1 transition"
                >
                  + Add Interest
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Reputation Score & Status */}
        <div className="space-y-6">
          
          {/* REPUTATION SCORE CARD */}
          <div className="bg-[#4338CA] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="flex justify-between items-center text-xs font-bold tracking-wider uppercase text-indigo-200">
              <span>Reputation Score</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-6xl font-black tracking-tight mt-4">982</h2>
            <p className="text-xs font-semibold text-indigo-100 mt-2">Top 5% of collaborators this semester</p>
            
            <div className="flex gap-2 mt-6">
              <span className="px-2.5 py-1 bg-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">High Trust</span>
              <span className="px-2.5 py-1 bg-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Team Leader</span>
            </div>
          </div>

          {/* COLLABORATION STATUS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Collaboration Status
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Experience Level</label>
              <select 
                value={collaboration.experienceLevel}
                onChange={(e) => setCollaboration(prev => ({ ...prev, experienceLevel: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-indigo-600 bg-slate-50 cursor-pointer"
              >
                <option value="Advanced Graduate Student">Advanced Graduate Student</option>
                <option value="Undergraduate Researcher">Undergraduate Researcher</option>
                <option value="Postdoctoral Fellow">Postdoctoral Fellow</option>
                <option value="Faculty / Advisor">Faculty / Advisor</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Preferred Role</label>
              <select 
                value={collaboration.preferredRole}
                onChange={(e) => setCollaboration(prev => ({ ...prev, preferredRole: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-indigo-600 bg-slate-50 cursor-pointer"
              >
                 <option value="">Select Preferred Role</option>
  <option>Frontend Developer</option>
  <option>Backend Developer</option>
  <option>Full-Stack Developer</option>
  <option>UI/UX Designer</option>
  <option>Database Developer</option>
  <option>AI / Machine Learning Developer</option>
  <option>Mobile App Developer</option>
  <option>DevOps Engineer</option>
  <option>QA / Software Tester</option>
  <option>Cybersecurity Specialist</option>
  <option>Project Manager / Team Leader</option>
  <option>Business Analyst</option>
  <option>System Analyst</option>
  <option>API Integration Developer</option>
  <option>Cloud Engineer</option>
  <option>Data Scientist</option>
  <option>Game Developer</option>
  <option>Embedded Systems Developer</option>
  <option>Documentation / Technical Writer</option>
  <option>No Preference</option>
</select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Weekly Availability: <span className="text-indigo-600 font-bold">{collaboration.weeklyHours} Hours</span>
              </label>
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-xs font-bold text-slate-700">{collaboration.weeklyHours}-20 Hours / Week</span>
                </div>
                {/* Interactive Slider Input */}
                <input 
                  type="range" 
                  min="5" 
                  max="40" 
                  value={collaboration.weeklyHours}
                  onChange={(e) => setCollaboration(prev => ({ ...prev, weeklyHours: parseInt(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4338CA]"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          RECENT PROJECTS & EXPERIENCE
         ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          Recent Projects & Experience ({projects.length})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Loop over dynamic project elements */}
          {projects.map((project) => (
            <div key={project.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition bg-white">
              <div>
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  </div>
                  <span className={`px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider rounded ${
                    project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm mt-3 text-slate-800">{project.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{project.description}</p>
              </div>
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 mt-4 pt-3 border-t border-slate-100">
                <span className={project.status === 'Completed' ? "text-amber-500" : "text-slate-400"}>{project.meta}</span>
                <span>{project.role}</span>
              </div>
            </div>
          ))}

          {/* Dotted Add Project Trigger Button */}
          <button 
            onClick={handleAddProject}
            className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-6 flex flex-col items-center justify-center gap-2 group transition text-center min-h-[160px] w-full bg-slate-50/50"
          >
            <div className="p-2 bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 rounded-full transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600 transition">Add New Experience</span>
          </button>

        </div>
      </div>

    </div>
  );
}