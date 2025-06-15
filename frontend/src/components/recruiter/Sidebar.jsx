import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { path: '/recruiter', label: 'Dashboard', icon: '📊' },
    { path: '/recruiter/post-job', label: 'Post Job', icon: '📝' },
    { path: '/recruiter/manage-jobs', label: 'Manage Jobs', icon: '💼' },
    { path: '/recruiter/applications', label: 'Applications', icon: '📄' },
    { path: '/recruiter/profile', label: 'Profile', icon: '👤' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out!');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    }
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="w-64 bg-white shadow-lg relative min-h-screen">
        {/* Company Logo/Name */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{user?.company || 'Recruiter Portal'}</h2>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                  isActive ? 'bg-blue-50 text-blue-600' : ''
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              {user?.name?.charAt(0) || 'R'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'Recruiter'}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full mt-2 px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 font-semibold border border-red-100"
          >
            Logout
          </button>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
              <h2 className="text-xl font-semibold mb-2 text-center">Logout Confirmation</h2>
              <p className="text-gray-600 mb-6 text-center">Are you sure you want to do logout?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 focus:outline-none"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded font-semibold hover:bg-blue-50 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar; 