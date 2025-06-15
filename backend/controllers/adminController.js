const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recruiter = require('../models/Recruiter');

// Generate JWT Token
const generateToken = (adminId) => {
    return jwt.sign({ adminId }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

// Admin Registration
exports.registerAdmin = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new admin
        const admin = new Admin({
            email,
            password,
            name
        });

        await admin.save();
        const token = generateToken(admin._id);

        res.status(201).json({
            message: 'Admin registered successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Error registering admin' });
    }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(admin._id);

        res.json({
            message: 'Login successful',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select('-password');
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching admin profile' });
    }
};

// Get all users (job seekers)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// Get all recruiters
exports.getAllRecruiters = async (req, res) => {
    try {
        const recruiters = await Recruiter.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: recruiters.length,
            data: recruiters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recruiters',
            error: error.message
        });
    }
};

// Get all users stats
exports.getUsersStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalRecruiters = await Recruiter.countDocuments();
        const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
        const activeRecruiters = await Recruiter.countDocuments({ isActive: true });
        
        // Get users registered in last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const newUsers = await User.countDocuments({
            role: 'user',
            createdAt: { $gte: thirtyDaysAgo }
        });
        
        const newRecruiters = await Recruiter.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalRecruiters,
                activeUsers,
                activeRecruiters,
                newUsers,
                newRecruiters
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user statistics',
            error: error.message
        });
    }
};

// Update user status (activate/deactivate)
exports.updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { isActive } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { isActive },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user status',
            error: error.message
        });
    }
};

// Update recruiter status
exports.updateRecruiterStatus = async (req, res) => {
    try {
        const recruiterId = req.params.id;
        const { isActive } = req.body;
        const recruiter = await Recruiter.findByIdAndUpdate(
            recruiterId,
            { isActive },
            { new: true }
        ).select('-password');

        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: 'Recruiter not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Recruiter ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: recruiter
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating recruiter status',
            error: error.message
        });
    }
}; 