const express = require('express');
const router = express.Router();
const {
  registerRecruiter,
  loginRecruiter,
  getRecruiterProfile,
  updateRecruiterProfile,
  getRecruiters,
  deleteRecruiter
} = require('../controllers/recruiterController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerRecruiter);
router.post('/login', loginRecruiter);

// Protected routes
router.route('/profile')
  .get(protect, getRecruiterProfile)
  .put(protect, updateRecruiterProfile);

// Admin routes
router.route('/')
  .get(protect, admin, getRecruiters);
router.route('/:id')
  .delete(protect, admin, deleteRecruiter);

module.exports = router; 