const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

class UnauthorizedError extends Error {
constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
}
}

const authMiddleware = async (req, res, next) => {
const token = req.header('Authorization')?.replace('Bearer ', '');

if (!token) {
    return next(new UnauthorizedError('No token, authorization denied'));
}

try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
    return next(new UnauthorizedError('User not found'));
    }

    req.user = user;
    next();
} catch (error) {
    next(new UnauthorizedError('Token is not valid'));
}
};

const roleMiddleware = (roles) => {
return (req, res, next) => {
    if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
    return next(new UnauthorizedError('Access denied'));
    }

    next();
};
};

module.exports = { authMiddleware, roleMiddleware };
