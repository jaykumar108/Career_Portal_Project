import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, ChevronDown, FileText, DownloadCloud, Mail, MoreVertical,
  Calendar, User, Briefcase, Building, MapPin, Clock, Check, X, Eye, Star,
  ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('appliedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data fetch from API
  useEffect(() => {
    setTimeout(() => {
      const mockApplications = [
        {
          id: 1,
          applicant: {
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            resume: 'john_smith_resume.pdf',
            coverLetter: "I'm excited to apply for the Senior Frontend Developer position at TechCorp..."
          },
          job: {
            title: 'Senior Frontend Developer',
            company: 'TechCorp',
            location: 'San Francisco, CA',
            type: 'Full-time'
          },
          appliedDate: '2023-06-10',
          status: 'Pending',
          notes: '',
          rating: 0
        },
        {
          id: 2,
          applicant: {
            name: 'Emily Johnson',
            email: 'emily.johnson@example.com',
            phone: '+1 (555) 987-6543',
            location: 'Austin, TX',
            resume: 'emily_johnson_resume.pdf',
            coverLetter: "I believe my experience in UX design makes me a strong candidate for the UX Designer position..."
          },
          job: {
            title: 'UX Designer',
            company: 'DesignHub',
            location: 'Austin, TX',
            type: 'Full-time'
          },
          appliedDate: '2023-06-09',
          status: 'Under Review',
          notes: 'Strong portfolio, schedule interview',
          rating: 4
        },
        {
          id: 3,
          applicant: {
            name: 'Michael Brown',
            email: 'michael.brown@example.com',
            phone: '+1 (555) 456-7890',
            location: 'Remote',
            resume: 'michael_brown_resume.pdf',
            coverLetter: "With my extensive background in cloud infrastructure, I am confident I can excel in the DevOps Engineer role..."
          },
          job: {
            title: 'DevOps Engineer',
            company: 'CloudSys',
            location: 'Remote',
            type: 'Full-time'
          },
          appliedDate: '2023-06-08',
          status: 'Interview',
          notes: 'Interview scheduled for June 15, 2023',
          rating: 5
        },
        {
          id: 4,
          applicant: {
            name: 'Sarah Wilson',
            email: 'sarah.wilson@example.com',
            phone: '+1 (555) 789-0123',
            location: 'New York, NY',
            resume: 'sarah_wilson_resume.pdf',
            coverLetter: "My product management experience at tech startups makes me an ideal candidate for this role..."
          },
          job: {
            title: 'Product Manager',
            company: 'InnovateTech',
            location: 'New York, NY',
            type: 'Full-time'
          },
          appliedDate: '2023-06-07',
          status: 'Rejected',
          notes: 'Not enough experience in B2B products',
          rating: 2
        },
        {
          id: 5,
          applicant: {
            name: 'David Lee',
            email: 'david.lee@example.com',
            phone: '+1 (555) 234-5678',
            location: 'Chicago, IL',
            resume: 'david_lee_resume.pdf',
            coverLetter: "I've been working with backend technologies for 5 years and am looking for new challenges..."
          },
          job: {
            title: 'Backend Developer',
            company: 'DataFlow',
            location: 'Chicago, IL',
            type: 'Full-time'
          },
          appliedDate: '2023-06-06',
          status: 'Pending',
          notes: '',
          rating: 0
        },
        {
          id: 6,
          applicant: {
            name: 'Jennifer Martinez',
            email: 'jennifer.martinez@example.com',
            phone: '+1 (555) 345-6789',
            location: 'Remote',
            resume: 'jennifer_martinez_resume.pdf',
            coverLetter: "I'm passionate about helping companies grow through effective marketing strategies..."
          },
          job: {
            title: 'Marketing Specialist',
            company: 'GrowthBoost',
            location: 'Remote',
            type: 'Part-time'
          },
          appliedDate: '2023-06-05',
          status: 'Under Review',
          notes: 'Great social media experience',
          rating: 3
        },
        {
          id: 7,
          applicant: {
            name: 'Robert Taylor',
            email: 'robert.taylor@example.com',
            phone: '+1 (555) 456-7890',
            location: 'Boston, MA',
            resume: 'robert_taylor_resume.pdf',
            coverLetter: "My background in data science and machine learning aligns perfectly with this role..."
          },
          job: {
            title: 'Data Scientist',
            company: 'AnalyticsPro',
            location: 'Boston, MA',
            type: 'Full-time'
          },
          appliedDate: '2023-06-04',
          status: 'Rejected',
          notes: 'Not enough experience with NLP',
          rating: 2
        },
        {
          id: 8,
          applicant: {
            name: 'Lisa Anderson',
            email: 'lisa.anderson@example.com',
            phone: '+1 (555) 567-8901',
            location: 'Denver, CO',
            resume: 'lisa_anderson_resume.pdf',
            coverLetter: "I love helping customers solve problems and have 3 years of experience in support roles..."
          },
          job: {
            title: 'Customer Support Specialist',
            company: 'ServiceFirst',
            location: 'Denver, CO',
            type: 'Full-time'
          },
          appliedDate: '2023-06-03',
          status: 'Interview',
          notes: 'Interview scheduled for June 12, 2023',
          rating: 4
        }
      ];
      
      setApplications(mockApplications);
      setLoading(false);
    }, 500);
  }, []);

  // Get filtered applications based on search term and status filter
  const getFilteredApplications = () => {
    return applications.filter(app => {
      // Search filter
      const matchesSearch = 
        app.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = 
        statusFilter === 'all' || 
        app.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  };

  // Sort applications
  const getSortedApplications = (filteredApplications) => {
    return [...filteredApplications].sort((a, b) => {
      if (sortField === 'appliedDate') {
        return sortDirection === 'asc' 
          ? new Date(a.appliedDate) - new Date(b.appliedDate)
          : new Date(b.appliedDate) - new Date(a.appliedDate);
      }
      
      if (sortField === 'rating') {
        return sortDirection === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      }
      
      // Default string comparison
      const aValue = sortField === 'applicant' ? a.applicant.name : a[sortField];
      const bValue = sortField === 'applicant' ? b.applicant.name : b[sortField];
      
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  // Pagination
  const itemsPerPage = 6;
  const filteredApplications = getFilteredApplications();
  const sortedApplications = getSortedApplications(filteredApplications);
  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);
  const paginatedApplications = sortedApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedApplications(paginatedApplications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  // Handle individual application selection
  const handleSelectApplication = (appId) => {
    if (selectedApplications.includes(appId)) {
      setSelectedApplications(selectedApplications.filter(id => id !== appId));
    } else {
      setSelectedApplications([...selectedApplications, appId]);
    }
  };

  // Handle pagination
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setSelectedApplications([]);
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

  // Open application detail modal
  const openDetailModal = (application) => {
    setSelectedApplication(application);
    setIsDetailModalOpen(true);
  };

  // Close application detail modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedApplication(null);
  };

  // Update application status
  const updateApplicationStatus = (id, newStatus) => {
    setApplications(
      applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    
    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({
        ...selectedApplication,
        status: newStatus
      });
    }
  };

  // Update application rating
  const updateApplicationRating = (id, rating) => {
    setApplications(
      applications.map(app => 
        app.id === id ? { ...app, rating } : app
      )
    );
    
    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({
        ...selectedApplication,
        rating
      });
    }
  };

  // Update application notes
  const updateApplicationNotes = (id, notes) => {
    setApplications(
      applications.map(app => 
        app.id === id ? { ...app, notes } : app
      )
    );
    
    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({
        ...selectedApplication,
        notes
      });
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under review':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render stars for rating
  const renderRatingStars = (rating, onRatingChange = null) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } ${onRatingChange ? 'cursor-pointer' : ''}`}
            onClick={() => onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Applications</h1>
          <p className="mt-2 text-gray-600">Review and process job applications</p>
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
                  placeholder="Search by applicant name, job title, or company"
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
                <option value="pending">Pending</option>
                <option value="under review">Under Review</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
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
                <label htmlFor="job-title" className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <select
                  id="job-title"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Job Titles</option>
                  <option value="frontend-developer">Frontend Developer</option>
                  <option value="backend-developer">Backend Developer</option>
                  <option value="devops-engineer">DevOps Engineer</option>
                  <option value="ux-designer">UX Designer</option>
                  <option value="product-manager">Product Manager</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <select
                  id="company"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Companies</option>
                  <option value="techcorp">TechCorp</option>
                  <option value="innovatetech">InnovateTech</option>
                  <option value="cloudsys">CloudSys</option>
                  <option value="designhub">DesignHub</option>
                  <option value="dataflow">DataFlow</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="date-applied" className="block text-sm font-medium text-gray-700">
                  Date Applied
                </label>
                <select
                  id="date-applied"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Any Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Selected items actions */}
          {selectedApplications.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                {selectedApplications.length} {selectedApplications.length === 1 ? 'application' : 'applications'} selected
              </p>
              <div className="flex space-x-2">
                <select
                  className="block w-full pl-3 pr-10 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="">Bulk Actions</option>
                  <option value="mark-pending">Mark as Pending</option>
                  <option value="mark-review">Mark as Under Review</option>
                  <option value="mark-interview">Mark as Interview</option>
                  <option value="mark-rejected">Mark as Rejected</option>
                </select>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            <div className="bg-gray-50">
              <div className="grid grid-cols-12 divide-x divide-gray-200">
                <div className="px-6 py-3 col-span-1 text-left">
                  <input
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    onChange={handleSelectAll}
                    checked={paginatedApplications.length > 0 && selectedApplications.length === paginatedApplications.length}
                  />
                </div>
                <div 
                  className="px-6 py-3 col-span-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('applicant')}
                >
                  <div className="flex items-center">
                    Applicant
                    {sortField === 'applicant' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-6 py-3 col-span-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </div>
                <div 
                  className="px-6 py-3 col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('appliedDate')}
                >
                  <div className="flex items-center">
                    Applied Date
                    {sortField === 'appliedDate' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-6 py-3 col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </div>
                <div className="px-6 py-3 col-span-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </div>
              </div>
            </div>
            <div className="bg-white divide-y divide-gray-200">
              {paginatedApplications.length > 0 ? (
                paginatedApplications.map((application) => (
                  <div key={application.id} className="grid grid-cols-12 divide-x divide-gray-200 hover:bg-gray-50">
                    <div className="px-6 py-4 col-span-1 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={selectedApplications.includes(application.id)}
                        onChange={() => handleSelectApplication(application.id)}
                      />
                    </div>
                    <div className="px-6 py-4 col-span-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {application.applicant.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {application.applicant.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-4 col-span-3">
                      <div className="text-sm font-medium text-gray-900">
                        {application.job.title}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Building className="h-3 w-3 mr-1" />
                        <span>{application.job.company}</span>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{application.job.location}</span>
                        <span className="mx-1">•</span>
                        <Briefcase className="h-3 w-3 mr-1" />
                        <span>{application.job.type}</span>
                      </div>
                    </div>
                    <div className="px-6 py-4 col-span-2 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {application.appliedDate}
                      </div>
                      <div className="mt-1">
                        {renderRatingStars(application.rating)}
                      </div>
                    </div>
                    <div className="px-6 py-4 col-span-2 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                      {application.notes && (
                        <div className="mt-1 text-xs text-gray-500 truncate max-w-[150px]" title={application.notes}>
                          {application.notes}
                        </div>
                      )}
                    </div>
                    <div className="px-6 py-4 col-span-1 whitespace-nowrap text-center">
                      <button 
                        onClick={() => openDetailModal(application)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-10 text-center">
                  <p className="text-gray-500">No applications found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Pagination */}
          {filteredApplications.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredApplications.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredApplications.length}</span> results
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
      
      {/* Application Detail Modal */}
      {isDetailModalOpen && selectedApplication && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Application Details
                  </h3>
                  <button 
                    onClick={closeDetailModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Left column - Applicant info */}
                    <div className="md:w-1/2">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Applicant Information</h4>
                      
                      <div className="mb-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <div className="text-lg font-medium text-gray-900">
                              {selectedApplication.applicant.name}
                            </div>
                            <div className="text-gray-500">{selectedApplication.applicant.location}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm">
                            <div className="text-gray-500">Email</div>
                            <a 
                              href={`mailto:${selectedApplication.applicant.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {selectedApplication.applicant.email}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm">
                            <div className="text-gray-500">Phone</div>
                            <a 
                              href={`tel:${selectedApplication.applicant.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {selectedApplication.applicant.phone}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm">
                            <div className="text-gray-500">Resume</div>
                            <div className="flex items-center">
                              <a 
                                href="#"
                                className="text-blue-600 hover:underline mr-2"
                              >
                                {selectedApplication.applicant.resume}
                              </a>
                              <button className="text-gray-400 hover:text-gray-600">
                                <DownloadCloud className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h5>
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded h-40 overflow-y-auto">
                          {selectedApplication.applicant.coverLetter}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right column - Job info and assessment */}
                    <div className="md:w-1/2">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Job Information</h4>
                      
                      <div className="mb-4 bg-gray-50 p-4 rounded">
                        <div className="font-medium text-gray-900">{selectedApplication.job.title}</div>
                        <div className="text-blue-600">{selectedApplication.job.company}</div>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{selectedApplication.job.location}</span>
                          <span className="mx-1">•</span>
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span>{selectedApplication.job.type}</span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm">
                            <div className="text-gray-500">Applied On</div>
                            <div className="font-medium">{selectedApplication.appliedDate}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Application Status</h5>
                        <select
                          value={selectedApplication.status}
                          onChange={(e) => updateApplicationStatus(selectedApplication.id, e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Interview">Interview</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      
                      <div className="mb-6">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Candidate Rating</h5>
                        {renderRatingStars(selectedApplication.rating, (rating) => updateApplicationRating(selectedApplication.id, rating))}
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Notes</h5>
                        <textarea
                          value={selectedApplication.notes}
                          onChange={(e) => updateApplicationNotes(selectedApplication.id, e.target.value)}
                          placeholder="Add notes about this candidate..."
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-32"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDetailModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;