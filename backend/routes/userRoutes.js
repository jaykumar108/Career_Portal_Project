const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount
} = require('../controllers/userController');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.patch('/profile', auth, updateProfile);
router.post('/change-password', auth, changePassword);
router.post('/deactivate', auth, deactivateAccount);

// Admin only routes
router.get('/admin/users', auth, checkRole(['Admin']), async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 