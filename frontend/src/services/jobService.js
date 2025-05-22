import api from './api';

// Get all jobs
export const getAllJobs = async () => {
  try {
    const response = await api.get('/jobs');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get job by ID
export const getJobById = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Post new job
export const postJob = async (jobData) => {
  try {
    const response = await api.post('/jobs', jobData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update job
export const updateJob = async (id, jobData) => {
  try {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete job
export const deleteJob = async (id) => {
  try {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get admin jobs
export const getAdminJobs = async () => {
  try {
    const response = await api.get('/jobs/admin/jobs');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 