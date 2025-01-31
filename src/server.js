const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
res.status(200).json({ status: 'ok' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace')
.then(() => {
    console.log('MongoDB connected');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

module.exports = { app };
