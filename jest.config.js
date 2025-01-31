module.exports = {
setupFilesAfterEnv: ['./__tests__/jest.setup.js'],
testEnvironment: 'node',
verbose: true,
testTimeout: 60000,
testMatch: ['**/__tests__/**/*.test.js'],
testPathIgnorePatterns: ['/node_modules/', 'jest.setup.js'],
forceExit: true,
clearMocks: true,
detectOpenHandles: true
};
