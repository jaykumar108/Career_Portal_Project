const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const defaultAdmin = {
    name: 'Jay',
    email: 'jsharma.dbg@gmail.com',
    mobile: '732092964',
    role: 'admin',
    password: 'admin@123'
};

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: defaultAdmin.email });
        if (existingAdmin) {
            console.log('Admin already exists');
            return;
        }

        // Create new admin
        const admin = new Admin(defaultAdmin);
        await admin.save();
        console.log('Default admin created successfully');
        
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
};

// Run the seed function
seedAdmin(); 