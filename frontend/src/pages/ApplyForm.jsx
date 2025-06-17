import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, Building, MapPin, Upload, Check, X, AlertCircle, ArrowLeft, Linkedin, Github, FileText, DollarSign, Clock, Mail, Phone, User, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getJobById } from '../services/jobService';

const ApplyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    coverLetter: '',
    linkedinProfile: '',
    portfolioUrl: '',
    resume: null,
    noticePeriod: '',
    currentSalary: '',
    expectedSalary: '',
    agreeToTerms: false
  });

  // Fetch job data from API
  useEffect(() => {
    setLoading(true);
    getJobById(id)
      .then((data) => {
        if (data && data.job) {
          const job = data.job;
          setJob({
            id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type ? job.type.charAt(0).toUpperCase() + job.type.slice(1) : '',
            logo: job.company?.logo || 'https://img.icons8.com/?size=100&id=23314&format=png&color=000000',
          });
        } else {
          setJob(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setJob(null);
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        e.target.value = null;
        return;
      }
      
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF or Word document');
        e.target.value = null;
        return;
      }
      
      setFormData({
        ...formData,
        resume: file
      });
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.resume) {
      setError('Please upload your resume');
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    setError(null);
    setSubmitting(true);
    
    try {
      const data = new FormData();
      data.append('jobId', id);
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('linkedinProfile', formData.linkedinProfile);
      data.append('portfolioUrl', formData.portfolioUrl);
      data.append('noticePeriod', formData.noticePeriod);
      data.append('currentSalary', formData.currentSalary);
      data.append('expectedSalary', formData.expectedSalary);
      data.append('coverLetter', formData.coverLetter);
      data.append('resume', formData.resume);
      // Send POST request
      await api.post('api/jobs/apply/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess(true);
      window.scrollTo(0, 0);
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (err) {
      setError('There was an error submitting your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying to {job.title} at {job.company}. We've received your application and will review it shortly.
          </p>
          <p className="text-gray-600 mb-6">
            You will be redirected to your profile page in a moment where you can track the status of your application.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/profile')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to My Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with job details */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to job details
        </button>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 mb-6 border border-white/10">
          <div className="flex items-start">
            <img 
              src={job.logo}
              alt={job.company}
              className="h-16 w-16 rounded-xl object-cover mr-4 border-2 border-white/20"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Apply for: {job.title}</h1>
              <div className="flex items-center mt-2">
                <Building className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-blue-300 font-medium">{job.company}</span>
              </div>
              <div className="flex items-center mt-2 text-gray-300">
                <MapPin className="h-5 w-5 text-blue-400 mr-2" />
                <span>{job.location}</span>
                <span className="mx-3">•</span>
                <Briefcase className="h-5 w-5 text-blue-400 mr-2" />
                <span>{job.type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-500/10 backdrop-blur-sm border border-red-500/20 p-4 rounded-xl">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-red-300">{error}</div>
            </div>
          </div>
        )}

        {/* Application form */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/10">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <User className="h-6 w-6 mr-2 text-blue-400" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="relative">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-300 mb-1">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    id="linkedinProfile"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="block w-full pl-10 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-300 mb-1">
                  Portfolio/GitHub URL
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    id="portfolioUrl"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/yourusername"
                    className="block w-full pl-10 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-blue-400" />
              Professional Information
            </h2>
            
            <div className="mb-6">
              <label htmlFor="resume" className="block text-sm font-medium text-gray-300 mb-1">
                Resume/CV * (PDF or Word document, max 5MB)
              </label>
              <div className="mt-1 flex justify-center px-6 py-8 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-200">
                <div className="space-y-3 text-center">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-blue-400" />
                  </div>
                  <div className="text-sm text-gray-300">
                    <label
                      htmlFor="resume"
                      className="relative cursor-pointer bg-blue-600/20 hover:bg-blue-600/30 px-4 py-2 rounded-lg font-medium text-blue-300 transition-colors duration-200"
                    >
                      <span>Upload your resume</span>
                      <input
                        id="resume"
                        name="resume"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="mt-2">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    PDF or Word documents up to 5MB
                  </p>
                </div>
              </div>
              {formData.resume && (
                <div className="mt-3 flex items-center text-sm text-green-400 bg-green-500/10 px-4 py-2 rounded-lg">
                  <Check className="h-5 w-5 mr-2" />
                  <span>
                    {formData.resume.name} ({Math.round(formData.resume.size / 1024)} KB)
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, resume: null })}
                    className="ml-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="relative">
                <label htmlFor="noticePeriod" className="block text-sm font-medium text-gray-300 mb-1">
                  Notice Period
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    id="noticePeriod"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleInputChange}
                    className="block w-full pl-10 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Notice Period</option>
                    <option value="Immediately">Immediately</option>
                    <option value="1 Week">1 Week</option>
                    <option value="2 Weeks">2 Weeks</option>
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                  </select>
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="currentSalary" className="block text-sm font-medium text-gray-300 mb-1">
                  Current Salary (INR)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="currentSalary"
                    name="currentSalary"
                    value={formData.currentSalary}
                    onChange={handleInputChange}
                    placeholder="e.g. 45,000"
                    className="block w-full pl-10 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-300 mb-1">
                  Expected Salary (INR)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="expectedSalary"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                    placeholder="e.g. 50,000"
                    className="block w-full pl-10 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-300 mb-1">
                Cover Letter / Additional Information
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows="5"
                value={formData.coverLetter}
                onChange={handleInputChange}
                placeholder="Tell us why you're excited about this role and what you can bring to the team..."
                className="block w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <div className="mb-8">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-700 rounded bg-gray-800/50"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="font-medium text-gray-300">
                    I agree to the <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">Terms and Conditions</a> and <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">Privacy Policy</a>
                  </label>
                  <p className="text-gray-400">
                    By checking this box, you agree that we can share your personal data with the employer and process it according to our privacy policy.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;