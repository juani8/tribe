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
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Token not provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById({ _id: decoded.id });
        if (!req.user) {
            return res.status(401).json({ message: 'User not found.' });
        }
        next();
    } catch (error) {
        console.error('Token error:', error);
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = auth;