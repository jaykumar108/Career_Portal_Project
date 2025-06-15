const Recruiter = require('../models/Recruiter');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new recruiter
// @route   POST /api/recruiters/register
// @access  Public
const registerRecruiter = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobile,
      companyName,
      companyWebsite,
      companySize,
      industry
    } = req.body;

    // Validate required fields
    const requiredFields = ['name', 'email', 'password', 'mobile', 'companyName', 'companyWebsite', 'companySize', 'industry'];
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

    // Validate website format
    const websiteRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!websiteRegex.test(companyWebsite)) {
      return res.status(400).json({ message: 'Invalid website URL format' });
    }

    // Check if recruiter already exists
    const recruiterExists = await Recruiter.findOne({ email });
    if (recruiterExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new recruiter
    const recruiter = await Recruiter.create({
      name,
      email,
      password,
      mobile,
      companyName,
      companyWebsite,
      companySize,
      industry
    });

    if (recruiter) {
      res.status(201).json({
        _id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        companyName: recruiter.companyName,
        role: recruiter.role,
        token: generateToken(recruiter._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid recruiter data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: error.message || 'Error registering recruiter',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Login recruiter
// @route   POST /api/recruiters/login
// @access  Public
const loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find recruiter by email
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await recruiter.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if recruiter is active
    if (!recruiter.isActive) {
      return res.status(401).json({ message: 'Your account has been deactivated' });
    }

    res.json({
      _id: recruiter._id,
      name: recruiter.name,
      email: recruiter.email,
      companyName: recruiter.companyName,
      role: recruiter.role,
      token: generateToken(recruiter._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recruiter profile
// @route   GET /api/recruiters/profile
// @access  Private
const getRecruiterProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.recruiter._id).select('-password');
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }
    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update recruiter profile
// @route   PUT /api/recruiters/profile
// @access  Private
const updateRecruiterProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.recruiter._id);
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    // Update fields
    recruiter.name = req.body.name || recruiter.name;
    recruiter.email = req.body.email || recruiter.email;
    recruiter.mobile = req.body.mobile || recruiter.mobile;
    recruiter.companyName = req.body.companyName || recruiter.companyName;
    recruiter.companyWebsite = req.body.companyWebsite || recruiter.companyWebsite;
    recruiter.companySize = req.body.companySize || recruiter.companySize;
    recruiter.industry = req.body.industry || recruiter.industry;

    // Update password if provided
    if (req.body.password) {
      recruiter.password = req.body.password;
    }

    const updatedRecruiter = await recruiter.save();

    res.json({
      _id: updatedRecruiter._id,
      name: updatedRecruiter.name,
      email: updatedRecruiter.email,
      companyName: updatedRecruiter.companyName,
      role: updatedRecruiter.role,
      token: generateToken(updatedRecruiter._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all recruiters (admin only)
// @route   GET /api/recruiters
// @access  Private/Admin
const getRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find({}).select('-password');
    res.json(recruiters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete recruiter
// @route   DELETE /api/recruiters/:id
// @access  Private/Admin
const deleteRecruiter = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    await recruiter.remove();
    res.json({ message: 'Recruiter removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerRecruiter,
  loginRecruiter,
  getRecruiterProfile,
  updateRecruiterProfile,
  getRecruiters,
  deleteRecruiter
}; 