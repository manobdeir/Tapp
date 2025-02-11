const User = require('../models/User');
const passwordUtils = require('../utils/passwordUtils');
const tokenUtils = require('../utils/tokenUtils');
const { ConflictError, ValidationError, UnauthorizedError } = require('../utils/errors');

const authController = {
async register(req, res, next) {
    try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ConflictError('Email already in use');
    }

    // Hash password
    const hashedPassword = await passwordUtils.hashPassword(password);

    // Create new user
    const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });

    // Attempt to save user (will trigger model validations)
    await user.save();

    // Generate JWT token
    const token = tokenUtils.generateToken(user);

    // Respond with user details
    res.status(201).json({
        success: true,
        data: {
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        },
        token
        }
    });
    } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return next(new ValidationError(errors.join(', ')));
    }

    // Pass other errors to central error handler
    next(error);
    }
},

async login(req, res, next) {
    try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isMatch = await passwordUtils.comparePassword(password, user.password);
    if (!isMatch) {
        throw new UnauthorizedError('Invalid credentials');
    }

    // Generate JWT token
    const token = tokenUtils.generateToken(user);

    // Respond with user details and token
    res.json({
        success: true,
        data: {
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        },
        token
        }
    });
    } catch (error) {
    next(error);
    }
}
};

module.exports = authController;
