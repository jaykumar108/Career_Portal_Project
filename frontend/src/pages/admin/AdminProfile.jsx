import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Save, Edit2, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AVATAR_URL = 'https://ui-avatars.com/api/?name=JS&background=0D8ABC&color=fff&size=128';

const AdminProfile = () => {
  const { user, updateAdminProfile, updateAdminPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateAdminProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      await updateAdminPassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Profile Card */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 border-b pb-8">
            <img
              src={AVATAR_URL}
              alt="Admin Avatar"
              className="w-28 h-28 rounded-full border-4 border-blue-200 shadow-md object-cover"
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">{formData.name || 'Admin'}</h2>
              <p className="text-gray-500 mt-1">{formData.email || 'admin@example.com'}</p>
              <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">Admin</span>
              <div className="mt-4 flex flex-col md:flex-row gap-2 justify-center md:justify-start">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center px-4 py-2 border border-blue-600 text-blue-700 bg-white rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                >
                  <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="flex items-center px-4 py-2 border border-gray-400 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                >
                  <Lock className="h-4 w-4 mr-2" /> Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Edit Profile Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fadeIn">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
                <form onSubmit={async (e) => {
                  await handleProfileUpdate(e);
                  setIsEditModalOpen(false);
                }} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10 block w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 p-2"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none p-2">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 block w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 p-2"
                          placeholder="admin@example.com"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 shadow"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Change Password Modal */}
          {isPasswordModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fadeIn">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                <form onSubmit={async (e) => {
                  await handlePasswordUpdate(e);
                  setIsPasswordModalOpen(false);
                }} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          id="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10 block w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 p-2"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10 block w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 p-2"
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          id="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10 block w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 p-2"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 shadow"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Forms Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Profile Form (hidden, only for modal) */}
            <div className="hidden md:block" />
            {/* Password Form (hidden, only for modal) */}
            <div className="hidden md:block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile; 