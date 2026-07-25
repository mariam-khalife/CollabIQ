import React from "react";
import { UserPlus, Users, Mail, MoreHorizontal } from "lucide-react";

const TeamMembers = ({ team, onInviteClick }) => {
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
              Team Members
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {team.length} members
          </span>
        </div>

        <div className="space-y-3">
          {team.map((member) => (
            <div 
              key={member.id} 
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:border-indigo-300 dark:group-hover:border-indigo-600 transition-colors"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                    {getInitials(member.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                    {member.name}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    {member.role}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                  {member.contrib}
                </span>
                <span className="block text-[8px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                  Contrib.
                </span>
              </div>
            </div>
          ))}
        </div>

        {team.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 dark:text-slate-500">
              No team members yet
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onInviteClick}
        className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 cursor-pointer group"
      >
        <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
        Invite Collaborator
      </button>
    </div>
  );
};

export default TeamMembers;