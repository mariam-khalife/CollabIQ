import React from "react";
import { UserPlus } from "lucide-react";

const TeamMembers = ({ team, onInviteClick }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-6 h-full">
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-4">
          Team Members
        </h3>

        <div className="space-y-4">
          {team.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {member.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{member.role}</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-indigo-600">
                {member.contrib}
                <span className="block text-[8px] text-slate-400 font-normal">
                  Contrib.
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onInviteClick}
        className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-indigo-600 text-slate-600 hover:text-indigo-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <UserPlus className="w-4 h-4" />
        Invite Collaborator
      </button>
    </div>
  );
};

export default TeamMembers;