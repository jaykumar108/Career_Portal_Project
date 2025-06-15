const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
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
router.post('/', auth, checkRole(['Admin']), postJob);
router.put('/:id', auth, checkRole(['Admin']), updateJob);
router.delete('/:id', auth, checkRole(['Admin']), deleteJob);
router.get('/admin/jobs', auth, checkRole(['Admin']), getAdminJobs);

module.exports = router; 