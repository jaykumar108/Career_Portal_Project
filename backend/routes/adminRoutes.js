const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAllUsers,
  getAllRecruiters,
  getUsersStats,
  updateUserStatus,
  updateRecruiterStatus
} = require('../controllers/adminController');
const User = require('../models/User');
const Recruiter = require('../models/Recruiter');


// Auth routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected admin routes
router.get('/profile', protect, admin, getAdminProfile);
router.get('/users', protect, admin, getAllUsers);
router.get('/recruiters', protect, admin, getAllRecruiters);
router.get('/users-stats', protect, admin, getUsersStats);
router.put('/users/:id/status', protect, admin, updateUserStatus);
router.put('/recruiters/:id/status', protect, admin, updateRecruiterStatus);

// Admin dashboard stats
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'User' });
    const totalAdmins = await User.countDocuments({ role: 'Admin' });
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    res.json({
      stats: {
        totalUsers,
        totalAdmins,
        activeUsers,
        inactiveUsers
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID (admin only)
router.get('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user (admin only)
router.patch('/users/:id', protect, admin, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'role', 'isActive', 'phone', 'address'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.json(user.getPublicProfile());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 