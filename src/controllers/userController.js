const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Register a new user
exports.registerUser = async (req, res) => {
try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
    return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
    username,
    email,
    password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Login user
exports.loginUser = async (req, res) => {
try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Get user profile
exports.getUserProfile = async (req, res) => {
try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
try {
    const { username, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
    req.user.id, 
    { username, email }, 
    { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Delete user
exports.deleteUser = async (req, res) => {
try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'User deleted successfully' });
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Get all users (admin route)
exports.getAllUsers = async (req, res) => {
try {
    const users = await User.find().select('-password');
    res.json(users);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

