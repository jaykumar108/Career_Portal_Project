import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Edit2, Save, X } from 'lucide-react';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    education: user?.education || [],
    experience: user?.experience || [],
    skills: user?.skills || []
  });
  const [newSkill, setNewSkill] = useState('');

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

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
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
                        <span className="text-gray-300">{user?.phone || 'Not provided'}</span>
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

                {/* Skills Section */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Skills</h2>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill"
                          className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={addSkill}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-600/50 text-white px-3 py-1 rounded-full flex items-center space-x-2"
                          >
                            <span>{skill}</span>
                            <button
                              onClick={() => removeSkill(skill)}
                              className="hover:text-red-400 transition-colors duration-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user?.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-600/50 text-white px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-600/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">0</div>
                      <div className="text-sm text-gray-300">Applications</div>
                    </div>
                    <div className="bg-blue-600/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">0</div>
                      <div className="text-sm text-gray-300">Interviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;