import React from "react";
import { Search, Bell, HelpCircle } from "lucide-react";


function Navbar() {

  return (

    <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0">

      {/* Search Box */}
      <div className="relative w-96">

        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />

        <input
          type="text"
          placeholder="Search projects, teams, or research..."
          className="w-full bg-[#F1F5F9] pl-10 pr-4 py-2 rounded-xl text-sm"
        />

      </div>


      {/* Actions */}
      <div className="flex items-center gap-4">

        <button className="relative p-1.5 text-slate-600">
          <Bell size={20}/>

          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full">
          </span>

        </button>


        <button className="p-1.5 text-slate-600">
          <HelpCircle size={20}/>
        </button>


        <div className="h-5 w-px bg-slate-200"></div>


        <button className="bg-[#312E81] text-white text-xs px-4 py-2 rounded-xl">
          + New Team
        </button>


      </div>


    </header>

  );

}


export default Navbar;