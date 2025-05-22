import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, ChevronDown, Edit, Trash2, Eye, MoreVertical,
  Calendar, DollarSign, MapPin, Briefcase, FileText, Clock, Check, X,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('posted');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Mock data fetch from API
  useEffect(() => {
    setTimeout(() => {
      const mockJobs = [
        {
          id: 1,
          title: 'Senior Frontend Developer',
          company: 'TechCorp',
          location: 'San Francisco, CA',
          type: 'Full-time',
          salary: '$120,000 - $150,000',
          status: 'Active',
          posted: '2023-05-15',
          expires: '2023-07-15',
          applications: 24
        },
        {
          id: 2,
          title: 'Product Manager',
          company: 'InnovateTech',
          location: 'New York, NY',
          type: 'Full-time',
          salary: '$130,000 - $160,000',
          status: 'Active',
          posted: '2023-05-18',
          expires: '2023-07-18',
          applications: 18
        },
        {
          id: 3,
          title: 'DevOps Engineer',
          company: 'CloudSys',
          location: 'Remote',
          type: 'Full-time',
          salary: '$110,000 - $140,000',
          status: 'Active',
          posted: '2023-05-20',
          expires: '2023-07-20',
          applications: 15
        },
        {
          id: 4,
          title: 'UX/UI Designer',
          company: 'DesignHub',
          location: 'Austin, TX',
          type: 'Full-time',
          salary: '$90,000 - $120,000',
          status: 'Active',
          posted: '2023-05-22',
          expires: '2023-07-22',
          applications: 12
        },
        {
          id: 5,
          title: 'Backend Developer',
          company: 'DataFlow',
          location: 'Chicago, IL',
          type: 'Full-time',
          salary: '$115,000 - $145,000',
          status: 'Active',
          posted: '2023-05-25',
          expires: '2023-07-25',
          applications: 10
        },
        {
          id: 6,
          title: 'Marketing Specialist',
          company: 'GrowthBoost',
          location: 'Remote',
          type: 'Part-time',
          salary: '$60,000 - $75,000',
          status: 'Inactive',
          posted: '2023-04-15',
          expires: '2023-06-15',
          applications: 22
        },
        {
          id: 7,
          title: 'Data Scientist',
          company: 'AnalyticsPro',
          location: 'Boston, MA',
          type: 'Full-time',
          salary: '$130,000 - $160,000',
          status: 'Draft',
          posted: 'Not posted',
          expires: 'N/A',
          applications: 0
        },
        {
          id: 8,
          title: 'Customer Support Specialist',
          company: 'ServiceFirst',
          location: 'Denver, CO',
          type: 'Full-time',
          salary: '$45,000 - $60,000',
          status: 'Expired',
          posted: '2023-03-10',
          expires: '2023-05-10',
          applications: 35
        }
      ];
      
      setJobs(mockJobs);
      setLoading(false);
    }, 500);
  }, []);

  // Get filtered jobs based on search term and status filter
  const getFilteredJobs = () => {
    return jobs.filter(job => {
      // Search filter
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = 
        statusFilter === 'all' || 
        job.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  };

  // Sort jobs
  const getSortedJobs = (filteredJobs) => {
    return [...filteredJobs].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle special cases for sorting
      if (sortField === 'posted' && aValue === 'Not posted') return 1;
      if (sortField === 'posted' && bValue === 'Not posted') return -1;
      
      if (sortField === 'applications') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // Default fallback
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  // Pagination
  const itemsPerPage = 6;
  const filteredJobs = getFilteredJobs();
  const sortedJobs = getSortedJobs(filteredJobs);
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const paginatedJobs = sortedJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedJobs(paginatedJobs.map(job => job.id));
    } else {
      setSelectedJobs([]);
    }
  };

  // Handle individual job selection
  const handleSelectJob = (jobId) => {
    if (selectedJobs.includes(jobId)) {
      setSelectedJobs(selectedJobs.filter(id => id !== jobId));
    } else {
      setSelectedJobs([...selectedJobs, jobId]);
    }
  };

  // Handle pagination
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setSelectedJobs([]);
  };

  // Handle sort
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle job deletion
  const openDeleteModal = (job) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const confirmDelete = () => {
    // In a real app, would send API request
    setJobs(jobs.filter(job => job.id !== jobToDelete.id));
    closeDeleteModal();
  };

  // Bulk delete selected jobs
  const bulkDeleteJobs = () => {
    // In a real app, would send API request
    setJobs(jobs.filter(job => !selectedJobs.includes(job.id)));
    setSelectedJobs([]);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
            <p className="mt-1 text-gray-600">Create, edit and manage job listings</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/admin/jobs/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Link>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1 md:mr-4">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search jobs by title, company, or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="expired">Expired</option>
              </select>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                More Filters
                <ChevronDown className={`ml-1 h-4 w-4 transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Advanced filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="job-type" className="block text-sm font-medium text-gray-700">
                  Job Type
                </label>
                <select
                  id="job-type"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <select
                  id="location"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Locations</option>
                  <option value="san-francisco">San Francisco, CA</option>
                  <option value="new-york">New York, NY</option>
                  <option value="remote">Remote</option>
                  <option value="austin">Austin, TX</option>
                  <option value="chicago">Chicago, IL</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="date-posted" className="block text-sm font-medium text-gray-700">
                  Date Posted
                </label>
                <select
                  id="date-posted"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Any Time</option>
                  <option value="today">Today</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="last-month">Last Month</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Selected items actions */}
          {selectedJobs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                {selectedJobs.length} {selectedJobs.length === 1 ? 'job' : 'jobs'} selected
              </p>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  Change Status
                </button>
                <button
                  type="button"
                  onClick={bulkDeleteJobs}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            <div className="bg-gray-50">
              <div className="grid grid-cols-12 divide-x divide-gray-200">
                <div className="px-6 py-3 col-span-1 text-left">
                  <input
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    onChange={handleSelectAll}
                    checked={paginatedJobs.length > 0 && selectedJobs.length === paginatedJobs.length}
                  />
                </div>
                <div 
                  className="px-6 py-3 col-span-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Job Title
                    {sortField === 'title' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-6 py-3 col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </div>
                <div 
                  className="px-6 py-3 col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('posted')}
                >
                  <div className="flex items-center">
                    Posted Date
                    {sortField === 'posted' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </div>
                <div 
                  className="px-6 py-3 col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('applications')}
                >
                  <div className="flex items-center">
                    Applications
                    {sortField === 'applications' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-6 py-3 col-span-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </div>
              </div>
            </div>
            <div className="bg-white divide-y divide-gray-200">
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job) => (
                  <div key={job.id} className="grid grid-cols-12 divide-x divide-gray-200 hover:bg-gray-50">
                    <div className="px-6 py-4 col-span-1 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={selectedJobs.includes(job.id)}
                        onChange={() => handleSelectJob(job.id)}
                      />
                    </div>
                    <div className="px-6 py-4 col-span-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {job.company}
                          </div>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{job.location}</span>
                            <span className="mx-1">•</span>
                            <Briefcase className="h-3 w-3 mr-1" />
                            <span>{job.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-4 col-span-2 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="px-6 py-4 col-span-2 whitespace-nowrap text-sm text-gray-500">
                      {job.posted}
                    </div>
                    <div className="px-6 py-4 col-span-2 whitespace-nowrap text-sm text-gray-500">
                      {job.applications} candidates
                    </div>
                    <div className="px-6 py-4 col-span-1 whitespace-nowrap text-center text-sm font-medium">
                      <div className="relative inline-block text-left">
                        <div className="dropdown inline-block relative">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          <ul className="dropdown-menu absolute hidden right-0 pt-1 w-48 bg-white rounded-md shadow-lg z-10">
                            <li>
                              <Link 
                                to={`/admin/jobs/${job.id}/edit`} 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <Edit className="h-4 w-4 mr-2 text-gray-500" />
                                Edit
                              </Link>
                            </li>
                            <li>
                              <Link 
                                to={`/jobs/${job.id}`} 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <Eye className="h-4 w-4 mr-2 text-gray-500" />
                                View
                              </Link>
                            </li>
                            <li>
                              <button 
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                onClick={() => openDeleteModal(job)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-10 text-center">
                  <p className="text-gray-500">No jobs found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Pagination */}
          {filteredJobs.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredJobs.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredJobs.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === i + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && jobToDelete && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Job Listing
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{jobToDelete.title}" at {jobToDelete.company}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;