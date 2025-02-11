const express = require('express');
const router = express.Router();
const { 
registerUser, 
loginUser, 
getUserProfile, 
updateUserProfile, 
deleteUser,
getAllUsers
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.delete('/', authMiddleware, deleteUser);
router.get('/', authMiddleware, getAllUsers);

module.exports = router;

