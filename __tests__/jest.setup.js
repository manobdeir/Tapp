const { jest, beforeAll, afterAll, afterEach } = require('@jest/globals');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { connectDB } = require('../src/server');

// Set test environment
process.env.NODE_ENV = 'test';

// Mock Redis
jest.mock('ioredis', () => require('ioredis-mock'));

// Mock Elasticsearch
jest.mock('@elastic/elasticsearch', () => ({
Client: jest.fn().mockImplementation(() => ({
    index: jest.fn().mockResolvedValue({}),
    search: jest.fn().mockResolvedValue({ hits: { hits: [] } }),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({})
}))
}));

let mongod;

beforeAll(async () => {
try {
    // Create MongoDB Memory Server
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    
    // Ensure any existing connections are closed
    if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    }
    
    // Connect to the in-memory database using our connectDB function
    await connectDB(mongoUri);
    console.log('Connected to MongoDB Memory Server:', mongoUri);
} catch (error) {
    console.error('MongoDB Setup Error:', error);
    throw error;
}
});

afterEach(async () => {
if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
    await collections[key].deleteMany();
    }
}
});

afterAll(async () => {
try {
    if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    }
    if (mongod) {
    await mongod.stop();
    }
} catch (error) {
    console.error('Cleanup Error:', error);
}
});

// Global test timeout
jest.setTimeout(30000);
// Global test timeout
jest.setTimeout(30000);
