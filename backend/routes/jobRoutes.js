const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  postJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getAdminJobs
} = require('../controllers/jobController');

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes (Admin only)
router.post('/', protect, authorize('Admin'), postJob);
router.put('/:id', protect, authorize('Admin'), updateJob);
router.delete('/:id', protect, authorize('Admin'), deleteJob);
router.get('/admin/jobs', protect, authorize('Admin'), getAdminJobs);

module.exports = router; 