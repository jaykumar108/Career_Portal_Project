const jwt = require('jsonwebtoken');
const Recruiter = require('../models/Recruiter');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      let user = null;
      
      // Check in Admin collection first
      user = await Admin.findById(decoded.adminId).select('-password');
      
      if (!user) {
        // If not found in Admin, check in User collection
        user = await User.findById(decoded.id).select('-password');
      }
      
      if (!user) {
        // If not found in User, check in Recruiter collection
        user = await Recruiter.findById(decoded.id).select('-password');
        if (user) {
          req.recruiter = user;
        }
      }

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error); 
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user instanceof Admin)) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// Recruiter middleware
const recruiter = (req, res, next) => {
  if (req.user && (req.user.role === 'recruiter' || req.user instanceof Recruiter)) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a recruiter' });
  }
};

module.exports = { protect, admin, recruiter }; 