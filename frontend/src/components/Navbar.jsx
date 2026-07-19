import React from "react";
import { Search, Bell, HelpCircle } from "lucide-react";

function Navbar() {
  return (
    // Ghayyerna px-4 sm:px-8 kirmal spacing ykoun mratab 3al mobile, w-zedna h-auto sm:h-16 py-3 sm:py-0 lal-flexibility
    <header className="min-h-[64px] border-b border-slate-200 bg-white px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 py-3 sm:py-0 shrink-0">

      {/* Search Box: w-full sm:w-72 md:w-96 bikhallih ya2khod 3ard dynamic mesh fixed */}
      <div className="relative w-full sm:w-72 md:w-96 order-2 sm:order-1">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full bg-[#F1F5F9] pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Actions: justify-between w-full sm:w-auto kirmal t-frod perfectly */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto order-1 sm:order-2">

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="relative p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Bell size={18} sm={20}/>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>

          {/* Hidden 3al-mobile kirmal ma yiz7am el-tlifon */}
          <button className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors hidden xs:block">
            <HelpCircle size={18} sm={20}/>
          </button>

          <div className="h-5 w-px bg-slate-200 hidden xs:block"></div>
        </div>

        <button className="bg-[#312E81] text-white text-[11px] sm:text-xs px-3 sm:px-4 py-2 rounded-xl hover:bg-indigo-900 transition-colors whitespace-nowrap shadow-sm">
          + New Team
        </button>

      </div>

    </header>
  );
}

export default Navbar;