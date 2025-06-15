require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Admin = require('./models/Admin');

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/jobs', jobRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Default Admin Data
const defaultAdmin = {
    name: 'Jay',
    email: 'jsharma.dbg@gmail.com',
    mobile: '732092964',
    role: 'admin',
    password: 'admin@123'
};

// Create Default Admin Function
const createDefaultAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: defaultAdmin.email });
        if (existingAdmin) {
            console.log('Default admin already exists');
            return;
        }

        // Create new admin
        const admin = new Admin(defaultAdmin);
        await admin.save();
        console.log('Default admin created successfully');
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        // Create default admin after successful connection
        await createDefaultAdmin();
        // Start server
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Health check: ${process.env.BACKEND_URL}`);
            console.log(`API endpoints: ${process.env.BACKEND_URL}/api`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Export for Vercel
module.exports = app; 