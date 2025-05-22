require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Admin = require('./models/Admin');

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Default Admin Data
const defaultAdmin = {
    name: 'Jay',
    email: 'jsharma.dbg@gmail.com',
    mobile: '732092964',
    role: 'Admin',
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

// MongoDB Connection and Server Start
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        // Create default admin after successful connection
        await createDefaultAdmin();
        
        // Start server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
}); 