const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Application = require('../models/Application');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Validate required fields
    const requiredFields = ['name', 'email', 'password', 'mobile'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate mobile format
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      mobile,
      role: 'user'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: error.message || 'Error registering user',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// User Signup
const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    res.json(req.user.getPublicProfile());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'phone', 'address', 'education', 'experience', 'skills', 'resume'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.json(req.user.getPublicProfile());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Deactivate Account
const deactivateAccount = async (req, res) => {
  try {
    req.user.isActive = false;
    await req.user.save();
    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all applications for the logged-in user
const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('job');
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
  getUserApplications
}; 