import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, Briefcase, FileText, 
  TrendingUp, Calendar, Clock,
  ArrowUpRight, ArrowDownRight,
  Plus, Search, Filter, LogOut
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  // Mock data for dashboard
  const stats = [
    {
      title: 'Total Jobs',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: <Briefcase className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-50'
    },
    {
      title: 'Active Applications',
      value: '2,345',
      change: '+8%',
      trend: 'up',
      icon: <FileText className="h-6 w-6 text-green-500" />,
      color: 'bg-green-50'
    },
    {
      title: 'Total Users',
      value: '1,234',
      change: '-3%',
      trend: 'down',
      icon: <Users className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-50'
    },
    {
      title: 'Interviews Scheduled',
      value: '45',
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

  const quickActions = [
    {
      title: 'Post New Job',
      icon: <Plus className="h-5 w-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      link: '/admin/post-job'
    },
    {
      title: 'View Applications',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      link: '/admin/applications'
    },
    {
      title: 'Manage Users',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      link: '/admin/users'
    },
    {
      title: 'Schedule Interview',
      icon: <Calendar className="h-5 w-5" />,
      color: 'bg-orange-500 hover:bg-orange-600',
      link: '/admin/schedule-interview'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 border border-transparent rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <a
                    key={index}
                    href={action.link}
                    className={`flex items-center justify-between p-4 rounded-lg text-white ${action.color} transition-colors duration-200`}
                  >
                    <div className="flex items-center">
                      {action.icon}
                      <span className="ml-3 font-medium">{action.title}</span>
                    </div>
                    <ArrowUpRight className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 