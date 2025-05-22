import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, ChevronDown, X, Building, DollarSign, Clock } from 'lucide-react';

const JobListings = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState([]);
  const [experience, setExperience] = useState([]);
  const [salary, setSalary] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  // Mock job data - in production would be fetched from API
  useEffect(() => {
    const mockJobs = [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'Bangalore, Karnataka',
        type: 'Full-time',
        experience: '3-5 years',
        salary: '₹12,00,000 - ₹15,00,000',
        description: 'We are looking for a Senior Frontend Developer to join our team...',
        posted: '2 days ago',
        logo: 'https://images.pexels.com/photos/5926393/pexels-photo-5926393.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
      },
      {
        id: 2,
        title: 'Product Manager',
        company: 'InnovateTech',
        location: 'Mumbai, Maharashtra',
        type: 'Full-time',
        experience: '5+ years',
        salary: '₹13,00,000 - ₹16,00,000',
        description: 'Exciting opportunity for a Product Manager to lead our product development...',
        posted: '1 day ago',
        logo: 'https://images.pexels.com/photos/15031637/pexels-photo-15031637/free-photo-of-letter-i-in-neon-light.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
      },
      {
        id: 3,
        title: 'DevOps Engineer',
        company: 'CloudSys',
        location: 'Remote',
        type: 'Full-time',
        experience: '2-4 years',
        salary: '₹11,00,000 - ₹14,00,000',
        description: 'Join our DevOps team to help build and maintain our cloud infrastructure...',
        posted: '3 days ago',
        logo: 'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
      },
      {
        id: 4,
        title: 'UX/UI Designer',
        company: 'DesignHub',
        location: 'Hyderabad, Telangana',
        type: 'Full-time',
        experience: '2-5 years',
        salary: '₹9,00,000 - ₹12,00,000',
        description: 'Looking for a talented UX/UI Designer to create beautiful, intuitive interfaces...',
        posted: '1 week ago',
        logo: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
      },
      {
        id: 5,
        title: 'Backend Developer',
        company: 'DataFlow',
        location: 'Delhi NCR',
        type: 'Full-time',
        experience: '3-6 years',
        salary: '₹11,50,000 - ₹14,50,000',
        description: 'Join our backend team to develop scalable and efficient APIs...',
        posted: '4 days ago',
        logo: 'https://images.pexels.com/photos/5926386/pexels-photo-5926386.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
      },
      {
        id: 6,
        title: 'Marketing Specialist',
        company: 'GrowthBoost',
        location: 'Remote',
        type: 'Part-time',
        experience: '1-3 years',
        salary: '₹6,00,000 - ₹7,50,000',
        description: 'Looking for a Marketing Specialist to help grow our online presence...',
        posted: '2 weeks ago',
        logo: 'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
      },
      {
        id: 7,
        title: 'Data Scientist',
        company: 'AnalyticsPro',
        location: 'Pune, Maharashtra',
        type: 'Full-time',
        experience: '3-5 years',
        salary: '₹13,00,000 - ₹16,00,000',
        description: 'Join our data science team to analyze complex datasets and build predictive models...',
        posted: '5 days ago',
        logo: 'https://images.pexels.com/photos/5474295/pexels-photo-5474295.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
      },
      {
        id: 8,
        title: 'Customer Support Specialist',
        company: 'ServiceFirst',
        location: 'Chennai, Tamil Nadu',
        type: 'Full-time',
        experience: '0-2 years',
        salary: '₹4,50,000 - ₹6,00,000',
        description: 'We are looking for a Customer Support Specialist to assist our clients...',
        posted: '1 week ago',
        logo: 'https://images.pexels.com/photos/5926397/pexels-photo-5926397.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
      }
    ];

    // Simulate API fetch
    setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 500);
  }, []);

  // Filter options
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];
  const experienceLevels = ['Entry Level', '1-3 years', '3-5 years', '5+ years'];
  const salaryRanges = [
    'All Salaries',
    '₹0 - ₹5,00,000',
    '₹5,00,000 - ₹10,00,000',
    '₹10,00,000 - ₹15,00,000',
    '₹15,00,000+'
  ];

  // Toggle job type filter
  const toggleJobType = (type) => {
    if (jobType.includes(type)) {
      setJobType(jobType.filter(t => t !== type));
    } else {
      setJobType([...jobType, type]);
    }
  };

  // Toggle experience filter
  const toggleExperience = (exp) => {
    if (experience.includes(exp)) {
      setExperience(experience.filter(e => e !== exp));
    } else {
      setExperience([...experience, exp]);
    }
  };

  // Handle salary change
  const handleSalaryChange = (e) => {
    setSalary(e.target.value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setJobType([]);
    setExperience([]);
    setSalary('');
  };

  // Filter jobs based on criteria
  const filteredJobs = jobs.filter(job => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (
      location === '' || job.location.toLowerCase().includes(location.toLowerCase())
    ) && (
      jobType.length === 0 || jobType.includes(job.type)
    ) && (
      experience.length === 0 || experience.includes(job.experience)
    ) && (
      salary === '' || salary === 'All Salaries' || job.salary.includes(salary)
    );
  });

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Job</h1>
          <p className="mt-2 text-gray-600">Discover opportunities that match your experience and goals</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow flex items-center px-4 py-2 border rounded-md">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Job title, company, or keywords"
                className="flex-grow bg-transparent text-gray-800 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-grow flex items-center px-4 py-2 border rounded-md">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Location"
                className="flex-grow bg-transparent text-gray-800 focus:outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Search
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-blue-600 font-medium"
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
              <ChevronDown className={`h-4 w-4 ml-1 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {(jobType.length > 0 || experience.length > 0 || salary !== '') && (
              <button 
                onClick={clearFilters}
                className="text-gray-600 hover:text-red-500 text-sm flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Job Type Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Job Type</h3>
                  <div className="space-y-2">
                    {jobTypes.map((type, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                          checked={jobType.includes(type)}
                          onChange={() => toggleJobType(type)}
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Experience Level</h3>
                  <div className="space-y-2">
                    {experienceLevels.map((exp, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                          checked={experience.includes(exp)}
                          onChange={() => toggleExperience(exp)}
                        />
                        <span className="ml-2 text-sm text-gray-700">{exp}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Salary Range</h3>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={salary}
                    onChange={handleSalaryChange}
                  >
                    {salaryRanges.map((range, index) => (
                      <option key={index} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-medium">{filteredJobs.length}</span> jobs
          </p>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Sort by:</span>
            <select className="bg-white border rounded-md px-3 py-1 text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Most Relevant</option>
              <option>Newest</option>
              <option>Highest Salary</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div 
                  key={job.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <img 
                        src={job.logo}
                        alt={job.company}
                        className="h-12 w-12 rounded-md object-cover mr-4 border border-gray-200"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                            <div className="flex items-center mt-1">
                              <Building className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-blue-600">{job.company}</span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{job.posted}</span>
                        </div>

                        <p className="mt-3 text-gray-600 line-clamp-2">{job.description}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                            <MapPin className="h-3 w-3 mr-1" />
                            {job.location}
                          </div>
                          <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {job.type}
                          </div>
                          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            <Clock className="h-3 w-3 mr-1" />
                            {job.experience}
                          </div>
                          <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {job.salary}
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Link 
                            to={`/jobs/${job.id}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">No matching jobs found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your search filters or exploring different keywords.
                </p>
                <div className="mt-6">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}

            {filteredJobs.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm">
                  <a href="#" className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-blue-50">
                    1
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-blue-50">
                    2
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-blue-50">
                    3
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </a>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;