import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Briefcase, MapPin, IndianRupee, Clock, Building, Calendar, Share2, 
  Bookmark, BookmarkCheck, Check, ChevronDown, ChevronUp, Users, Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getJobById } from '../services/jobService';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [error, setError] = useState(null);

  // Fetch job details from API
  useEffect(() => {
    setLoading(true);
    setError(null);
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
            experience: job.requirements || '', // Adjust if you have a separate experience field
            salary: job.salary,
            posted: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '',
            deadline: job.deadline ? new Date(job.deadline).toLocaleDateString() : '',
            logo: 'https://images.pexels.com/photos/5926393/pexels-photo-5926393.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', // Placeholder
            companyInfo: job.companyInfo || 'No company info available.',
            description: job.description ? `<p>${job.description}</p>` : '<p>No description available.</p>',
            skills: job.skills && job.skills.length > 0 ? job.skills : ['N/A'],
            applications: job.applications ? job.applications.length : 0,
            vacancies: job.vacancies || 1
          });
        } else {
          setJob(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch job details.');
        setLoading(false);
      });
  }, [id]);

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    // In a real app, would send this to the server
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600">{error}</h3>
          <p className="mt-2 text-sm text-gray-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-600">Job not found.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex text-sm text-gray-500 space-x-2">
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors duration-200">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/jobs" className="hover:text-blue-600 transition-colors duration-200">Jobs</Link>
            </li>
            <li>/</li>
            <li className="text-blue-600 truncate">{job.title}</li>
          </ol>
        </nav>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <img 
                src={job.logo}
                alt={job.company}
                className="h-16 w-16 rounded-md object-cover border border-gray-200 mb-4 sm:mb-0 sm:mr-6"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <div className="mt-1 flex items-center">
                  <Building className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-blue-600 font-medium">{job.company}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    {job.location}
                  </div>
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    <Briefcase className="h-4 w-4 mr-1 text-blue-500" />
                    {job.type}
                  </div>
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    <IndianRupee className="h-4 w-4 mr-1 text-green-500" />
                    {job.salary}
                  </div>
                  <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                    <Award className="h-4 w-4 mr-1 text-yellow-500" />
                    {job.experience}
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:mt-0 flex sm:flex-col items-center gap-3">
                <Link
                  to={`/apply/${job.id}`}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors duration-200"
                >
                  Apply Now
                </Link>
                <button
                  onClick={shareJob}
                  className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-md text-sm font-medium border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-200 pt-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Posted</div>
                  <div className="font-medium">{job.posted}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Apply Before</div>
                  <div className="font-medium">{job.deadline}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Applicants</div>
                  <div className="font-medium">{job.applications} applied</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div 
                className={`prose max-w-none ${!showFullDescription && 'max-h-72 overflow-hidden relative'}`}
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
              
              {!showFullDescription && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
              )}
              
              <button 
                onClick={toggleDescription}
                className="mt-4 flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200"
              >
                {showFullDescription ? (
                  <>
                    Show Less
                    <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show More
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About {job.company}</h2>
              <p className="text-gray-700">{job.companyInfo}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Summary</h2>
              <ul className="space-y-3">
                <li className="flex">
                  <Briefcase className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Job Type</div>
                    <div className="font-medium">{job.type}</div>
                  </div>
                </li>
                <li className="flex">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-medium">{job.location}</div>
                  </div>
                </li>
                <li className="flex">
                  <IndianRupee className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Salary</div>
                    <div className="font-medium">{job.salary}</div>
                  </div>
                </li>
                <li className="flex">
                  <Award className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Experience</div>
                    <div className="font-medium">{job.experience}</div>
                  </div>
                </li>
                <li className="flex">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Posted Date</div>
                    <div className="font-medium">{job.posted}</div>
                  </div>
                </li>
                <li className="flex">
                  <Clock className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Closing Date</div>
                    <div className="font-medium">{job.deadline}</div>
                  </div>
                </li>
                <li className="flex">
                  <Users className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Vacancies</div>
                    <div className="font-medium">{job.vacancies} positions</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Apply?</h3>
              <p className="text-gray-700 mb-4">Submit your application now for this exciting opportunity at {job.company}.</p>
              {user ? (
                <Link 
                  to={`/apply/${job.id}`}
                  className="w-full block text-center bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Apply Now
                </Link>
              ) : (
                <>
                  <Link 
                    to={`/login?redirect=/apply/${job.id}`}
                    className="w-full block text-center bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Login to Apply
                  </Link>
                  <p className="mt-2 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-800">
                      Sign up
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;