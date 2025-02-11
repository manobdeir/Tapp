const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { ValidationError } = require('../utils/errors');
const passwordUtils = require('../utils/passwordUtils');

const validationMiddleware = {
registerValidation: [
    body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .custom(async (email) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        throw new Error('Email already in use');
        }
        return true;
    }),
    body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .custom(password => {
        if (!passwordUtils.validatePasswordStrength(password)) {
        throw new Error('Password must include uppercase, lowercase, number, and special character');
        }
        return true;
    }),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    this.validateRequest
],

loginValidation: [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
    this.validateRequest
],

validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
    }
    next();
}
};

module.exports = validationMiddleware;

