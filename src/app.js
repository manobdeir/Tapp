import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import logger from './marketplace/utils/logger';
import productRoutes from './marketplace/routes/productRoutes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);

// Database connection
const connectDatabase = async () => {
try {
    await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });
    logger.info('MongoDB connected successfully');
} catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
}
};

// Error handling middleware
app.use((err, req, res, next) => {
logger.error(err.stack);
res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
});
});

// Start server
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    connectDatabase();
});
}

export default app;

