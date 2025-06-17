const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
  postJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getAdminJobs,
  uploadResume,
  getAllApplications,
  updateApplicationStatus
} = require('../controllers/jobController');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getAllJobs);

// Admin-only: Get all applications
router.get('/applications', auth, checkRole(['admin']), getAllApplications);

// Admin-only: Update application status
router.patch('/applications/:id/status', auth, checkRole(['admin']), updateApplicationStatus);

// Protected routes (Admin only)
router.post('/', auth, checkRole(['admin']), postJob);
router.put('/:id', auth, checkRole(['admin']), updateJob);
router.delete('/:id', auth, checkRole(['admin']), deleteJob);
router.get('/admin/jobs', auth, checkRole(['admin']), getAdminJobs);

// Resume upload route
router.post('/apply/upload', auth, upload.single('resume'), uploadResume);

// Protected routes (Admin only)
router.get('/:id', getJobById);

module.exports = router;  