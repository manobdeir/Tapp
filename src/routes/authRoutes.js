const express = require('express');
const router = express.Router();
const { 
registerUser, 
loginUser, 
logoutUser,
getCurrentUser 
} = require('../controllers/authController');
const { 
validateRegistration, 
validateLogin 
} = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);

// Protected Routes
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logoutUser);

module.exports = router;

