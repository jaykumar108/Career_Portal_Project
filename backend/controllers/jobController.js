const Job = require('../models/Job');
const supabase = require('../utils/supabaseClient');
const Application = require('../models/Application');

// Post a new job
const postJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      deadline,
      skills
    } = req.body;

    // Create new job with postedBy from the authenticated admin
    const job = new Job({
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      deadline,
      skills,
      postedBy: req.user._id // This will be set from the auth middleware
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({
      success: false,
      message: 'Error posting job',
      error: error.message
    });
  }
};

// Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    let query = Job.find()
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });
    if (!isNaN(limit) && limit > 0) {
      query = query.limit(limit);
    }
    const jobs = await query;

    res.status(200).json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

// Get job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email')
      .populate('applications');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if the job was posted by the current admin
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
};

// Delete job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if the job was posted by the current admin
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
};

// Get jobs posted by admin
const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin jobs',
      error: error.message
    });
  }
};

const uploadResume = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Supabase upload
    const fileName = `resumes/${Date.now()}_${file.originalname}`;
    const { data, error } = await supabase
      .storage
      .from('resumes')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      return res.status(500).json({ error: 'Failed to upload to Supabase', details: error.message });
    }

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('resumes')
      .getPublicUrl(fileName);
    const resumeUrl = publicUrlData.publicUrl;

    // Save to Application model with all details
    const application = await Application.create({
      user: req.user._id,
      job: req.body.jobId,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      linkedinProfile: req.body.linkedinProfile,
      portfolioUrl: req.body.portfolioUrl,
      noticePeriod: req.body.noticePeriod,
      currentSalary: req.body.currentSalary,
      expectedSalary: req.body.expectedSalary,
      resume: resumeUrl,
      coverLetter: req.body.coverLetter || '',
    });

    res.status(201).json({ message: 'Resume uploaded and application created', application });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job')
      .populate('user');
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching applications', error: error.message });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('job').populate('user');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.status(200).json({ success: true, message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating application status', error: error.message });
  }
};

module.exports = {
  postJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getAdminJobs,
  uploadResume,
  getAllApplications,
  updateApplicationStatus
}; 