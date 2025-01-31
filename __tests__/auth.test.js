const request = require('supertest');
const { app } = require('../src/server');
const User = require('../src/models/User');
const mongoose = require('mongoose');

describe('Authentication Tests', () => {
beforeAll(async () => {
    // Clear users collection before all tests
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
});

describe('User Registration', () => {
    const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'Password123!'
    };

    it('should successfully register a new user', async () => {
    const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email', testUser.email);
    expect(response.body.user).toHaveProperty('firstName', testUser.firstName);
    expect(response.body.user).toHaveProperty('lastName', testUser.lastName);
    expect(response.body.user).not.toHaveProperty('password');

    // Verify user was saved to database
    const savedUser = await User.findOne({ email: testUser.email });
    expect(savedUser).toBeTruthy();
    expect(savedUser.email).toBe(testUser.email);
    });

    it('should not register user with existing email', async () => {
    // First, create a user
    await User.create(testUser);

    // Try to register the same user again
    const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Email already exists');
    });

    it('should validate required fields', async () => {
    const invalidUser = {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        password: 'short'
    };

    const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toContain('First name is required');
    expect(response.body.errors).toContain('Last name is required');
    expect(response.body.errors).toContain('Valid email is required');
    expect(response.body.errors).toContain('Password must be at least 8 characters');
    });

    it('should hash the password before saving', async () => {
    const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

    expect(response.statusCode).toBe(201);

    const savedUser = await User.findOne({ email: testUser.email });
    expect(savedUser.password).not.toBe(testUser.password);
    expect(savedUser.password).toMatch(/^\$2[ayb]\$[\d]+\$/); // Check for bcrypt hash format
    });
});
});
