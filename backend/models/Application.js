const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  linkedinProfile: { type: String },
  portfolioUrl: { type: String },
  noticePeriod: { type: String },
  currentSalary: { type: String },
  expectedSalary: { type: String },
  resume: { type: String, required: true }, // URL
  coverLetter: { type: String },
  status: { type: String, default: 'pending' },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema); 