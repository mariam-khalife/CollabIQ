import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Pencil, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  GripVertical,
  Check
} from 'lucide-react';

export default function Roadmap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [phases, setPhases] = useState([
    {
      id: 1,
      name: 'Phase 1: Planning',
      status: 'COMPLETED',
      timeline: 'Aug 15 - Aug 30',
      isExpanded: false,
      progress: 100,
      avatars: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
      ],
      tasks: [
        { id: 101, title: 'Project Scope Definition', assignee: 'Sarah C.', deadline: 'Aug 20', priority: 'HIGH', completed: true },
        { id: 102, title: 'Architecture Diagramming', assignee: 'Alex M.', deadline: 'Aug 28', priority: 'MEDIUM', completed: true }
      ]
    },
    {
      id: 3,
      name: 'Phase 3: Development',
      status: 'IN PROGRESS',
      timeline: 'Oct 01 - Nov 15',
      isExpanded: true,
      progress: 45,
      avatars: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
      ],
      tasks: [
        { 
          id: 301, 
          title: 'API Integration with Core Node', 
          assignee: 'Michael T.', 
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          deadline: 'Oct 24', 
          priority: 'HIGH', 
          completed: false 
        },
        { 
          id: 302, 
          title: 'Core Engine Dev: P2P Socket Layer', 
          assignee: 'Sarah C.', 
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
          deadline: 'Oct 10', 
          priority: 'MEDIUM', 
          completed: true 
        }
      ]
    },
    {
      id: 4,
      name: 'Phase 4: Testing & QA',
      status: 'PLANNED',
      timeline: 'Nov 16 - Nov 30',
      isExpanded: false,
      progress: 0,
      avatars: [],
      tasks: [
        { id: 401, title: 'End-to-End Test Suite', assignee: 'David K.', deadline: 'Nov 20', priority: 'HIGH', completed: false }
      ]
    }
  ]);

  // Toggle Phase Accordion
  const togglePhase = (phaseId) => {
    setPhases(phases.map(p => p.id === phaseId ? { ...p, isExpanded: !p.isExpanded } : p));
  };

  // Toggle Task Completion
  const toggleTask = (phaseId, taskId) => {
    setPhases(phases.map(phase => {
      if (phase.id === phaseId) {
        const updatedTasks = phase.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        return { ...phase, tasks: updatedTasks };
      }
      return phase;
    }));
  };

  // Delete Task
  const deleteTask = (phaseId, taskId) => {
    setPhases(phases.map(phase => {
      if (phase.id === phaseId) {
        return { ...phase, tasks: phase.tasks.filter(t => t.id !== taskId) };
      }
      return phase;
    }));
  };

  // Add Task Prompt
  const handleAddTask = (phaseId) => {
    const title = prompt('Enter Task Title:');
    if (!title) return;
    
    setPhases(phases.map(phase => {
      if (phase.id === phaseId) {
        const newTask = {
          id: Date.now(),
          title,
          assignee: 'Mariam K.',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
          deadline: 'Nov 05',
          priority: 'MEDIUM',
          completed: false
        };
        return { ...phase, tasks: [...phase.tasks, newTask] };
      }
      return phase;
    }));
  };

  // Add New Roadmap Phase
  const handleAddPhase = () => {
    const name = prompt('Enter Phase Name (e.g., Phase 5: Deployment):');
    if (!name) return;

    const newPhase = {
      id: Date.now(),
      name,
      status: 'PLANNED',
      timeline: 'Dec 01 - Dec 15',
      isExpanded: true,
      progress: 0,
      avatars: [],
      tasks: []
    };
    setPhases([...phases, newPhase]);
  };

  // Filter tasks based on top search bar
  const filteredPhases = phases.map(phase => ({
    ...phase,
    tasks: phase.tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8 font-sans text-slate-800">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-sm font-medium text-slate-500 mb-1">
            Projects / <span className="text-slate-700 font-semibold">NeuralArch</span> / <span className="text-slate-900">Roadmap</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Roadmap Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, generate, and manage the phases and tasks of your project roadmap.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAddPhase}
            className="px-5 py-2.5 text-sm font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-sm"
          >
            Create Manually
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all duration-200 shadow-md shadow-indigo-100">
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-8">
        
        {/* Project Context Subheader */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">NeuralArch: Distributed Intelligence</h2>
              <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100/80 rounded-full border border-emerald-200">
                Active
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">A collaborative framework for P2P neural network training.</p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-slate-100">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Progress</div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-extrabold text-indigo-600">65%</span>
                <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Timeline</div>
              <div className="text-base font-bold text-slate-800">Aug 15 - Dec 15</div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Phases</div>
              <div className="text-base font-bold text-slate-800">5 Total</div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Completed</div>
              <div className="text-base font-bold text-slate-800">2 Phases</div>
            </div>
          </div>
        </div>

        {/* Search Bar inside Page */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center px-6">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search roadmap tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Timeline / Roadmap Phases List */}
        <div className="p-6 md:p-8 space-y-6">
          {filteredPhases.map((phase) => (
            <div key={phase.id} className="relative flex items-start gap-4">
              
              {/* Timeline Status Node */}
              <div className="flex flex-col items-center mt-3">
                {phase.status === 'COMPLETED' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-200">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
                {phase.status === 'IN PROGRESS' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center ring-4 ring-indigo-100 shadow-md">
                    <Clock className="w-4 h-4" />
                  </div>
                )}
                {phase.status === 'PLANNED' && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-400 flex items-center justify-center">
                    <Circle className="w-4 h-4 fill-slate-200 stroke-none" />
                  </div>
                )}
                <div className="w-0.5 h-full bg-slate-200 my-2 -mb-8"></div>
              </div>

              {/* Phase Card */}
              <div className={`flex-1 rounded-2xl border transition-all duration-200 overflow-hidden ${
                phase.isExpanded ? 'border-indigo-300 ring-2 ring-indigo-500/10 bg-indigo-50/20' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}>
                
                {/* Phase Header */}
                <div className="p-4 md:p-5 flex items-center justify-between cursor-pointer select-none" onClick={() => togglePhase(phase.id)}>
                  <div className="flex items-center gap-3">
                    {phase.isExpanded && <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />}
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-slate-900">{phase.name}</h3>
                        <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md tracking-wider ${
                          phase.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          phase.status === 'IN PROGRESS' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {phase.status}
                        </span>
                      </div>

                      {/* Mini Progress Bar under header */}
                      {phase.status === 'IN PROGRESS' && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-28 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${phase.progress}%` }}></div>
                          </div>
                          <span className="text-xs font-semibold text-indigo-600">{phase.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Header Info */}
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-semibold text-slate-500">{phase.timeline}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{phase.tasks.length} Tasks</div>
                    </div>

                    {/* Team Avatars */}
                    <div className="flex -space-x-2 overflow-hidden">
                      {phase.avatars.map((url, i) => (
                        <img key={i} className="inline-block h-7 w-7 rounded-full ring-2 ring-white" src={url} alt="Avatar" />
                      ))}
                      {phase.avatars.length > 2 && (
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold ring-2 ring-white">
                          +{phase.avatars.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1 border-l border-slate-200 pl-3 text-slate-400">
                      <button className="p-1 hover:text-indigo-600 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:text-rose-600 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {phase.isExpanded ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Tasks Section */}
                {phase.isExpanded && (
                  <div className="border-t border-slate-200 bg-white">
                    
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-2.5 bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <div className="col-span-5">Task Title</div>
                      <div className="col-span-2">Assignee</div>
                      <div className="col-span-2">Deadline</div>
                      <div className="col-span-1">Priority</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* Task Rows */}
                    <div className="divide-y divide-slate-100">
                      {phase.tasks.length === 0 ? (
                        <div className="p-6 text-center text-sm text-slate-400">No tasks created for this phase yet.</div>
                      ) : (
                        phase.tasks.map((task) => (
                          <div key={task.id} className="grid grid-cols-12 gap-4 px-6 py-3.5 items-center hover:bg-slate-50/80 transition-colors text-sm">
                            
                            {/* Checkbox + Title */}
                            <div className="col-span-5 flex items-center gap-3">
                              <input 
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(phase.id, task.id)}
                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                              />
                              <span className={`font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                {task.title}
                              </span>
                            </div>

                            {/* Assignee */}
                            <div className="col-span-2 flex items-center gap-2">
                              {task.avatar && <img src={task.avatar} className="w-6 h-6 rounded-full" alt="" />}
                              <span className="text-xs text-slate-600 font-medium truncate">{task.assignee}</span>
                            </div>

                            {/* Deadline */}
                            <div className="col-span-2 text-xs font-medium text-slate-500">{task.deadline}</div>

                            {/* Priority Badge */}
                            <div className="col-span-1">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                                task.priority === 'HIGH' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                              }`}>
                                {task.priority}
                              </span>
                            </div>

                            {/* Status Badge */}
                            <div className="col-span-1">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                                task.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {task.completed ? 'DONE' : 'IN PROGRESS'}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="col-span-1 flex items-center justify-end gap-2 text-slate-400">
                              <button className="hover:text-indigo-600"><Pencil className="w-3.5 h-3.5" /></button>
                              <button onClick={() => deleteTask(phase.id, task.id)} className="hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Task Button */}
                    <div className="p-3 bg-indigo-50/30 border-t border-slate-100 text-center">
                      <button 
                        onClick={() => handleAddTask(phase.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 py-1 px-3 rounded-lg hover:bg-indigo-50 transition-all"
                      >
                        <Plus className="w-4 h-4" /> Add New Task
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </div>
          ))}

          {/* Add New Roadmap Phase Card Button */}
          <div 
            onClick={handleAddPhase}
            className="border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/50 hover:bg-indigo-50/20 group"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-300 flex items-center justify-center shadow-sm transition-all mb-2">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-500 group-hover:text-indigo-600">Add New Roadmap Phase</span>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Last saved: 2 minutes ago
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800">Cancel Changes</button>
            <button className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm">
              Save Roadmap
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}