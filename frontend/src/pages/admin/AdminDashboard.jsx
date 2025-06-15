import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, Briefcase, FileText, 
  TrendingUp, Calendar, Clock,
  ArrowUpRight, ArrowDownRight,
  Search, Filter
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { getAllJobs } from '../../services/jobService';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalUsers: 0,
    interviewsScheduled: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch jobs data
        const response = await getAllJobs();
        const jobs = response.jobs || [];
        
        // Calculate stats
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter(job => job.status === 'active').length;
        
        setStats(prevStats => ({
          ...prevStats,
          totalJobs,
          activeJobs
        }));
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardStats = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs.toString(),
      change: '+12%',
      trend: 'up',
      icon: <Briefcase className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-50'
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs.toString(),
      change: '+8%',
      trend: 'up',
      icon: <FileText className="h-6 w-6 text-green-500" />,
      color: 'bg-green-50'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      change: '-3%',
      trend: 'down',
      icon: <Users className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-50'
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviewsScheduled.toString(),
      change: '+5%',
      trend: 'up',
      icon: <Calendar className="h-6 w-6 text-orange-500" />,
      color: 'bg-orange-50'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'application',
      title: 'New Application Received',
      description: 'John Doe applied for Senior Developer position',
      time: '5 minutes ago',
      icon: <FileText className="h-5 w-5 text-blue-500" />
    },
    {
      id: 2,
      type: 'job',
      title: 'New Job Posted',
      description: 'Frontend Developer position has been posted',
      time: '1 hour ago',
      icon: <Briefcase className="h-5 w-5 text-green-500" />
    },
    {
      id: 3,
      type: 'user',
      title: 'New User Registration',
      description: 'Sarah Smith created a new account',
      time: '2 hours ago',
      icon: <Users className="h-5 w-5 text-purple-500" />
    },
    {
      id: 4,
      type: 'interview',
      title: 'Interview Scheduled',
      description: 'Interview scheduled with Mike Johnson',
      time: '3 hours ago',
      icon: <Calendar className="h-5 w-5 text-orange-500" />
    }
  ];

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="mt-1 text-sm text-gray-500">Here's what's happening with your portal today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="mt-1 text-sm text-gray-500">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className={`p-2 rounded-lg ${activity.type === 'application' ? 'bg-blue-50' : 
                  activity.type === 'job' ? 'bg-green-50' : 
                  activity.type === 'user' ? 'bg-purple-50' : 'bg-orange-50'}`}>
                  {activity.icon}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 