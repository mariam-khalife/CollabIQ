import React from "react";
import { Link } from "react-router-dom";

import {
 LayoutDashboard,
 User,
 Users,
 Cpu,
 Lightbulb,
 FolderGit2,
 Bell,
 Award,
 Settings,
 Plus
} from "lucide-react";


function Sidebar() {

  return (

    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6 shrink-0">

      <div className="space-y-8">

        <div>
          <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-1">
            CollabIQ
          </h1>

          <p className="text-[11px] font-medium text-slate-400 tracking-wider mt-0.5">
            Academic Excellence
          </p>
        </div>


        <nav className="space-y-1">

          <Link 
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-3"
          >
            <LayoutDashboard size={18}/>
            Dashboard
          </Link>


          <Link 
          to="/profile"
          className="flex items-center gap-3 px-4 py-3"
          >
            <User size={18}/>
            My Profile
          </Link>


          <Link 
          to="/team-management"
          className="flex items-center gap-3 px-4 py-3"
          >
            <Users size={18}/>
            Team Management
          </Link>


        </nav>


      </div>


      <div className="pt-4 border-t border-slate-100 flex items-center gap-3">

        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500"
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <h4 className="text-sm font-bold">
            Alex Rivera
          </h4>

          <p className="text-xs text-slate-400">
            Computer Science
          </p>
        </div>

      </div>


    </aside>

  );

}


export default Sidebar;