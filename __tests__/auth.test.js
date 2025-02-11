const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const http = require('http');
const createApp = require('../src/server');
const User = require('../src/models/User');
const originalConfig = require('../src/config');

// Increase timeout for async operations
jest.setTimeout(30000);

let mongoServer;
let app;
let server;
let testPort;
let mongoConnection;

beforeAll(async () => {
try {
    // Create MongoDB memory server before any mocking
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Explicitly connect to MongoDB
    mongoConnection = await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    });

    // Mock config to use memory server URI
    jest.replaceProperty(originalConfig, 'MONGODB_URI', mongoUri);

    // Create app with dynamic port
    app = createApp();
    testPort = await getAvailablePort();
    server = http.createServer(app);

    // Start the server with a timeout
    await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
        reject(new Error('Server start timeout'));
    }, 10000);

    server.listen(testPort, () => {
        clearTimeout(timeout);
        resolve();
    });

    server.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
    });
    });
} catch (error) {
    console.error('Error in beforeAll:', error);
    throw error;
}
});

afterAll(async () => {
try {
    // Restore original config
    jest.restoreAllMocks();

    // Close server with timeout
    if (server) {
    await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
        reject(new Error('Server close timeout'));
        }, 5000);

        server.close((err) => {
        clearTimeout(timeout);
        if (err) reject(err);
        else resolve();
        });
    });
    }

    // Disconnect Mongoose connection
    if (mongoConnection) {
    await mongoConnection.disconnect();
    }

    // Stop MongoDB memory server
    if (mongoServer) {
    await mongoServer.stop();
    }
} catch (error) {
    console.error('Error in afterAll:', error);
    throw error;
}
});

// Helper function to find an available port
function getAvailablePort() {
return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(0, () => {
    const port = server.address().port;
    server.close(() => {
        resolve(port);
    });
    });
    server.on('error', reject);
});
}

describe('Authentication', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');

    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).toBeTruthy();
  });

  it('should not register a user with an existing email', async () => {
    await User.create({
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123'
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'duplicateuser',
        email: 'existing@example.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('User already exists');
  });
});
