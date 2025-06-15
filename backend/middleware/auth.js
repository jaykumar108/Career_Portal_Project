const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Try to find user first
        let user = await User.findById(decoded.userId);
        
        if (!user) {
            // If user not found, try to find admin
            const admin = await Admin.findById(decoded.adminId);
            if (!admin) {
                throw new Error();
            }
            req.admin = admin;
            admin.role = 'Admin'; // Set role directly on admin object
            req.user = admin;
            req.isAdmin = true;
        } else {
            req.user = user;
            req.isAdmin = false;
        }

        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        next();
    };
};

module.exports = {
    auth,
    checkRole
}; 