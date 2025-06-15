import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import PostJob from './PostJob';
import ManageJobs from './ManageJobs';
import Applications from './Applications';
import Profile from './Profile';

const RecruiterDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/manage-jobs" element={<ManageJobs />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard; 