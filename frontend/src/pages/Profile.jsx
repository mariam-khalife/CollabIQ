// Profile.jsx (Should ONLY be the main dashboard view)
import React from 'react';

const Profile = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Row */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Profile Overview</h1>
          <p className="text-sm text-gray-500">Manage your academic identity and team matching preferences.</p>
        </div>
        <div className="space-x-3">
          <button className="px-4 py-2 border rounded-md">Edit Profile</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md">Save Changes</button>
        </div>
      </div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Profile Card (Takes up 2 columns) */}
        <div className="col-span-2 bg-white p-6 border rounded-xl"> ... </div>
        
        {/* Reputation Card (Takes up 1 column) */}
        <div className="col-span-1 bg-indigo-600 text-white p-6 rounded-xl"> ... </div>
      </div>
    </div>
  );
};

export default Profile;