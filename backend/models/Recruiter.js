const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const recruiterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  companyWebsite: {
    type: String,
    required: [true, 'Company website is required'],
    trim: true
  },
  companySize: {
    type: String,
    required: [true, 'Company size is required'],
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Other']
  },
  role: {
    type: String,
    default: 'recruiter',
    enum: ['recruiter']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
recruiterSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
recruiterSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports = Recruiter; 