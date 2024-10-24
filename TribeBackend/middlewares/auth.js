const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

/**
 * Middleware to verify and decode the JWT token provided in the Authorization header.
 *
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {Function} next - Middleware function to pass control to the next middleware.
 */
const auth = async (req, res, next) => {
    console.log('Authorization Header:', req.header('Authorization'));
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    console.log('Extracted Token:', token);

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Token not provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);  // Log the decoded token
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            console.log('User not found');
            return res.status(401).json({ message: 'User not found.' });
        }

        console.log('Authenticated user:', req.user); // Log the authenticated user
        next();
    } catch (error) {
        console.error('Token error:', error);
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = auth;