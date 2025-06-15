import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
  Users, Briefcase, FileText,
  TrendingUp, Calendar,
  Plus, LogOut, User,
  Menu, X as CloseIcon, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const quickActions = [
    {
      title: 'Dashboard',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-blue-500',
      link: '/admin/dashboard'
    },
    {
      title: 'Post New Job',
      icon: <Plus className="h-5 w-5" />,
      color: 'text-green-500',
      link: '/admin/post-job'
    },
    {
      title: 'View Applications',
      icon: <FileText className="h-5 w-5" />,
      color: 'text-indigo-500',
      link: '/admin/applications'
    },
    {
      title: 'Manage Users',
      icon: <Users className="h-5 w-5" />,
      color: 'text-purple-500',
      link: '/admin/users'
    },
    {
      title: 'Schedule Interview',
      icon: <Calendar className="h-5 w-5" />,
      color: 'text-orange-500',
      link: '/admin/schedule-interview'
    },
    {
      title: 'Profile Settings',
      icon: <User className="h-5 w-5" />,
      color: 'text-pink-500',
      link: '/admin/profile'
    }
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
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-screen">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <img src="/logo.jpg" alt="Career Portal Logo" className="h-10 w-10 object-contain" />
              <span className="ml-2 text-xl font-semibold text-gray-800">Admin Portal</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 group ${location.pathname === action.link ? 'bg-blue-50' : ''}`}
                >
                  <span className={`${action.color}`}>{action.icon}</span>
                  <span className="ml-3">{action.title}</span>
                  <ChevronRight className={`ml-auto h-4 w-4 text-gray-400 group-hover:text-gray-600 ${location.pathname === action.link ? 'text-blue-500' : ''}`} />
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center w-full px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
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
    </>
  );
};

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <div className="lg:hidden bg-white shadow px-4 py-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 