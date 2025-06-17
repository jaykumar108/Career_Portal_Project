import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Edit2, Save, X, Eye } from 'lucide-react';
import api from '../services/api';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    education: [],
    experience: []
  });
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.mobile || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: ''
        },
        education: user.education || [],
        experience: user.experience || []
      });
    }
  }, [user]);

  useEffect(() => {
    // Fetch user's applied applications count
    const fetchApplications = async () => {
      try {
        const res = await api.get('/api/users/applications');
        setApplicationsCount(res.data.applications.length || 0);
      } catch (err) {
        setApplicationsCount(0);
      }
    };
    fetchApplications();
  }, []);

  const fetchApplicationsDetails = async () => {
    setApplicationsLoading(true);
    setApplicationsError('');
    try {
      const res = await api.get('/api/users/applications');
      setApplications(res.data.applications || []);
    } catch (err) {
      setApplicationsError('Failed to fetch applications');
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden">
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800">
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center">
                <span className="text-4xl text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
              >
                {isEditing ? (
                  <>
                    <X className="h-5 w-5" />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="h-5 w-5" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Basic Info */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300">City</label>
                          <input
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            className="mt-1 block w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300">State</label>
                          <input
                            type="text"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            className="mt-1 block w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-blue-400" />
                        <span className="text-gray-300">{user?.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-blue-400" />
                        <span className="text-gray-300">{user?.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-blue-400" />
                        <span className="text-gray-300">{user?.mobile || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-blue-400" />
                        <span className="text-gray-300">
                          {user?.address?.city && user?.address?.state
                            ? `${user.address.city}, ${user.address.state}`
                            : 'Location not provided'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Stats & Role */}
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Role</span>
                      <span className="px-3 py-1 bg-blue-600/50 text-white rounded-full text-sm">
                        {user?.role}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Member Since</span>
                      <span className="text-gray-300">
                        {new Date(user?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Last Login</span>
                      <span className="text-gray-300">
                        {user?.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Quick Stats</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-blue-600/20 rounded-lg p-4 flex flex-col items-center">
                      <div className="text-2xl font-bold text-white">{applicationsCount}</div>
                      <div className="text-sm text-gray-300">Applications</div>
                      <button
                        className="mt-2 flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 text-xs"
                        onClick={() => { setShowApplicationsModal(true); fetchApplicationsDetails(); }}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View Applied Applications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Modal */}
      {showApplicationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={() => setShowApplicationsModal(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900">Applied Applications</h2>
            {applicationsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : applicationsError ? (
              <div className="text-center text-red-500 py-4">{applicationsError}</div>
            ) : applications.length === 0 ? (
              <div className="text-center text-gray-500 py-4">No applications found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Applied On</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr key={app._id}>
                        <td className="px-4 py-2 text-gray-900">{app.job?.title || '-'}</td>
                        <td className="px-4 py-2 text-gray-900">{app.job?.company || '-'}</td>
                        <td className="px-4 py-2 text-gray-700">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '-'}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            app.status === 'approved' ? 'bg-green-100 text-green-700' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;