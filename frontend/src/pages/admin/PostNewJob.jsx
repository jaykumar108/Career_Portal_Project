import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Building, MapPin, DollarSign, Clock, Calendar, FileText, ArrowLeft, Plus, Edit2, Trash2, Power } from 'lucide-react';
import { postJob, getAllJobs, updateJob, deleteJob } from '../../services/jobService';
import { toast } from 'react-toastify';

const PostNewJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary: '',
    description: '',
    requirements: '',
    deadline: '',
    skills: []
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoadingJobs(true);
      const response = await getAllJobs();
      setJobs(response.jobs || []);
    } catch (error) {
      toast.error('Error fetching jobs');
      setJobs([]);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (selectedJob) {
        // If editing existing job
        await updateJob(selectedJob._id, formData);
        toast.success('Job updated successfully!');
      } else {
        // If creating new job
        await postJob(formData);
      toast.success('Job posted successfully!');
      }
      setShowModal(false);
      fetchJobs(); // Refresh jobs list
      // Reset form and selected job
      setFormData({
        title: '',
        company: '',
        location: '',
        type: 'full-time',
        salary: '',
        description: '',
        requirements: '',
        deadline: '',
        skills: []
      });
      setSelectedJob(null);
    } catch (error) {
      toast.error(error.message || 'Error saving job');
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleEditJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await updateJob(selectedJob._id, formData);
      toast.success('Job updated successfully!');
      setShowJobDetails(false);
      fetchJobs(); // Refresh jobs list
    } catch (error) {
      toast.error(error.message || 'Error updating job');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(selectedJob._id);
        toast.success('Job deleted successfully!');
        setShowJobDetails(false);
        fetchJobs(); // Refresh jobs list
      } catch (error) {
        toast.error(error.message || 'Error deleting job');
      }
    }
  };

  const handleDeactivateJob = async () => {
    try {
      await updateJob(selectedJob._id, { status: 'closed' });
      toast.success('Job deactivated successfully!');
      setShowJobDetails(false);
      fetchJobs(); // Refresh jobs list
    } catch (error) {
      toast.error(error.message || 'Error deactivating job');
    }
  };

  const handleActivateJob = async () => {
    try {
      await updateJob(selectedJob._id, { status: 'active' });
      toast.success('Job activated successfully!');
      setShowJobDetails(false);
      fetchJobs(); // Refresh jobs list
    } catch (error) {
      toast.error(error.message || 'Error activating job');
    }
  };

  const handleEditClick = () => {
    setFormData({
      title: selectedJob.title,
      company: selectedJob.company,
      location: selectedJob.location,
      type: selectedJob.type,
      salary: selectedJob.salary,
      description: selectedJob.description,
      requirements: selectedJob.requirements,
      deadline: selectedJob.deadline,
      skills: selectedJob.skills || []
    });
    setShowJobDetails(false);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Post New Job Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jobs Management</h1>
            <p className="mt-2 text-gray-600">Manage and post new job listings</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Post New Job
          </button>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">All Posted Jobs</h2>
            <span className="text-sm text-gray-500">{jobs.length} jobs posted</span>
          </div>
          <div className="divide-y divide-gray-200">
            {isLoadingJobs ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading jobs...</p>
              </div>
            ) : Array.isArray(jobs) && jobs.length > 0 ? (
              jobs.map((job) => (
                <div 
                  key={job._id} 
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => handleJobClick(job)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          job.type === 'full-time' ? 'bg-green-100 text-green-800' :
                          job.type === 'part-time' ? 'bg-blue-100 text-blue-800' :
                          job.type === 'contract' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {job.type}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {job.location}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="text-gray-500 mr-1">₹</span>
                        {job.salary}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No jobs posted yet
              </div>
            )}
          </div>
        </div>

        {/* Job Details Modal */}
        {showJobDetails && selectedJob && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-4 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
                  <button
                    onClick={() => setShowJobDetails(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedJob.title}</h3>
                      <p className="mt-1 text-lg text-gray-600">{selectedJob.company}</p>
                      <p className="text-sm text-gray-500">Posted by: {selectedJob.postedBy?.name}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        selectedJob.type === 'full-time' ? 'bg-green-100 text-green-800' :
                        selectedJob.type === 'part-time' ? 'bg-blue-100 text-blue-800' :
                        selectedJob.type === 'contract' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedJob.type}
                      </span>
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        selectedJob.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedJob.status}
                      </span>
                    </div>
                  </div>

                  {/* Job Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-gray-500 mr-2">₹</span>
                      <span>{selectedJob.salary}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Deadline: {new Date(selectedJob.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedJob.description}</p>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Requirements</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedJob.requirements}</p>
                  </div>

                  {/* Skills */}
                  {selectedJob.skills && selectedJob.skills.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Posted on: {new Date(selectedJob.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditClick}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit Job
                      </button>
                      {selectedJob.status === 'active' ? (
                        <button
                          onClick={handleDeactivateJob}
                          className="px-4 py-2 text-sm font-medium text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 flex items-center gap-2"
                        >
                          <Power className="h-4 w-4" />
                          Close Job
                        </button>
                      ) : (
                        <button
                          onClick={handleActivateJob}
                          className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 flex items-center gap-2"
                        >
                          <Power className="h-4 w-4" />
                          Activate Job
                        </button>
                      )}
                      <button
                        onClick={handleDeleteJob}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Job
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post New Job Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-4 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">Post New Job</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedJob ? 'Edit Job' : 'Basic Information'}
                    </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Company name"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. New York, NY"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Job Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Type</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Salary</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-lg">₹</span>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 80000"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Job Description</label>
              <div className="mt-1">
                <textarea
                  rows={4}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the role and responsibilities..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Requirements</label>
              <div className="mt-1">
                <textarea
                  rows={4}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List the required skills and qualifications..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedJob(null);
                        setFormData({
                          title: '',
                          company: '',
                          location: '',
                          type: 'full-time',
                          salary: '',
                          description: '',
                          requirements: '',
                          deadline: '',
                          skills: []
                        });
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
            <button
              type="submit"
              disabled={loading}
                      className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
                      {loading ? 'Saving...' : selectedJob ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostNewJob; 