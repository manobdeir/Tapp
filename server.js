const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./src/utils/connectDB');
const errorHandler = require('./src/middleware/errorMiddleware');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const config = require('./src/config');

const app = express();
const PORT = config.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reviews', reviewRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
console.log('SIGTERM received. Shutting down gracefully');
server.close(() => {
    mongoose.connection.close(false, () => {
    process.exit(0);
    });
});
});

// Export app for testing and other modules
module.exports = { 
app, 
server, 
startServer: () => {
    connectDB();
    return server;
}
};

