require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Admin = require('./models/Admin');

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Pre-flight requests
app.options('*', cors());

app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

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

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        // Create default admin after successful connection
        await createDefaultAdmin();
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Export for Vercel
module.exports = app; 