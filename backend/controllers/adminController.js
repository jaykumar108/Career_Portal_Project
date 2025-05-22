const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (adminId) => {
    return jwt.sign({ adminId }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

// Admin Registration
const registerAdmin = async (req, res) => {
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
const loginAdmin = async (req, res) => {
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
const getAdminProfile = async (req, res) => {
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

module.exports = {
    registerAdmin,
    loginAdmin,
    getAdminProfile
}; 