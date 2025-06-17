import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, Search, Filter, ChevronDown, 
  CheckCircle, XCircle, Clock, ArrowLeft,
  Download, Eye, Trash2
} from 'lucide-react';
import api from '../../services/api';
import { toast, Toaster } from 'react-hot-toast';

const ViewApplications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get('api/jobs/applications');
        setApplications(res.data.applications || []);
      } catch (err) {
        setError('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'approved') return 'Selected';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredApplications = applications
    .filter(app => {
      const matchesSearch =
        (app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.company?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id + status);
    if (status === 'approved') {
      toast.success('Application Selected!');
    } else if (status === 'rejected') {
      toast.success('Application Rejected!');
    }
    try {
      await api.patch(`api/jobs/applications/${id}/status`, { status });
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">View Applications</h1>
          <p className="mt-2 text-gray-600">Manage and review job applications</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application, index) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{application.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.job?.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.job?.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(application.appliedAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{getStatusLabel(application.status)}</span>
                        </span>
                        <div className="relative">
                          <button
                            className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                            onClick={() => {
                              const dropdownId = `dropdown-${application._id}`;
                              const dropdown = document.getElementById(dropdownId);
                              if (dropdown) {
                                dropdown.classList.toggle('hidden');
                              }
                            }}
                          >
                            Actions
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </button>
                          <div
                            id={`dropdown-${application._id}`}
                            className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                          >
                            <div className="py-1">
                              {application.status !== 'approved' && (
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 disabled:opacity-50"
                                  disabled={updatingId === application._id + 'approved'}
                                  onClick={() => {
                                    handleStatusUpdate(application._id, 'approved');
                                    document.getElementById(`dropdown-${application._id}`).classList.add('hidden');
                                  }}
                                >
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Selected
                                  </div>
                                </button>
                              )}
                              {application.status !== 'rejected' && (
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                                  disabled={updatingId === application._id + 'rejected'}
                                  onClick={() => {
                                    handleStatusUpdate(application._id, 'rejected');
                                    document.getElementById(`dropdown-${application._id}`).classList.add('hidden');
                                  }}
                                >
                                  <div className="flex items-center">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </div>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => window.open(application.resume, '_blank')}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3 mr-4">
                        <a href={application.resume} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-900">
                          <Download className="h-5 w-5" />
                        </a>
                       
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewApplications; 