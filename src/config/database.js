const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection configuration
const connectDB = async () => {
try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
    });
    console.log('MongoDB connected successfully');
} catch (error) {
    console.error('MongoDB connection error:', error);
    // Exit process with failure
    process.exit(1);
}
};

// Add event listeners for database connection
mongoose.connection.on('disconnected', () => {
console.log('Lost MongoDB connection');
});

mongoose.connection.on('reconnected', () => {
console.log('Reconnected to MongoDB');
});

module.exports = connectDB;

