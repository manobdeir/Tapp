/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
preset: 'ts-jest/presets/default-esm',
testEnvironment: 'node',
extensionsToTreatAsEsm: ['.ts', '.tsx'],
transform: {
    '^.+\\.tsx?$': ['ts-jest', {
    useESM: true,
    tsconfig: '<rootDir>/tsconfig.json',
    diagnostics: {
        warnOnly: true
    }
    }]
},
moduleNameMapper: {
    '^@/models/(.*)$': '<rootDir>/src/models/$1',
    '^@/controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/routes/(.*)$': '<rootDir>/src/routes/$1',
    '^(\\.{1,2}/.*)\\.ts$': '$1'
},
resolver: '<rootDir>/jest-resolver.cjs',
roots: ['<rootDir>/tests', '<rootDir>/src'],
testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
coverageDirectory: '<rootDir>/coverage',
collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!**/node_modules/**',
    '!**/tests/**'
],
coverageThreshold: {
    global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50
    }
},
verbose: true
};
