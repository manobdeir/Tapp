const request = require('supertest');
const { app, server } = require('../src/server');

describe('Server Tests', () => {
describe('Health Check', () => {
    test('should return 200 OK with status', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    });
});

afterAll(async () => {
    if (server && server.close) {
    await new Promise((resolve) => server.close(resolve));
    }
});
});
