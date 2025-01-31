require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const { Client } = require('@elastic/elasticsearch');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

// Initialize database clients
const mongoClient = mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const redisClient = new Redis(process.env.REDIS_URI);

const elasticClient = new Client({
    node: process.env.ELASTICSEARCH_URI,
});

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Apply middleware
app.use(morgan('combined'));
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Helper functions for health checks
const checkMongoConnection = async () => {
    try {
        return mongoose.connection.readyState === 1;
    } catch (error) {
        return false;
    }
};

const checkRedisConnection = async () => {
    try {
        await redisClient.ping();
        return true;
    } catch (error) {
        return false;
    }
};

const checkElasticsearchConnection = async () => {
    try {
        await elasticClient.ping();
        return true;
    } catch (error) {
        return false;
    }
};

// Health check endpoint
app.get('/health', async (req, res) => {
    const mongoStatus = await checkMongoConnection();
    const redisStatus = await checkRedisConnection();
    const elasticStatus = await checkElasticsearchConnection();
    
    const servicesStatus = {
        mongodb: {
            status: mongoStatus ? 'healthy' : 'degraded',
            connection: mongoStatus ? 'connected' : 'disconnected'
        },
        redis: {
            status: redisStatus ? 'healthy' : 'degraded',
            connection: redisStatus ? 'connected' : 'disconnected'
        },
        elasticsearch: {
            status: elasticStatus ? 'healthy' : 'degraded',
            connection: elasticStatus ? 'connected' : 'disconnected'
        }
    };
    
    const allHealthy = mongoStatus && redisStatus && elasticStatus;
    
    res.status(allHealthy ? 200 : 503).json({
        status: allHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        services: servicesStatus
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// Export app and clients for testing and server initialization
module.exports = {
    app,
    mongoClient,
    redisClient,
    elasticClient
};
