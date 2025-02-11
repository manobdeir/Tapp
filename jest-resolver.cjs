const path = require('path');
const fs = require('fs');

function resolveWithExtensions(basePath, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
for (const ext of extensions) {
    const fullPath = basePath + ext;
    if (fs.existsSync(fullPath)) {
    return fullPath;
    }
}
return null;
}

module.exports = (request, options) => {
// Handle TypeScript path aliases
const pathAliases = {
    '@/models': '<rootDir>/src/models',
    '@/controllers': '<rootDir>/src/controllers',
    '@/types': '<rootDir>/src/types',
    '@/utils': '<rootDir>/src/utils'
};

// Resolve path aliases first
for (const [alias, replacement] of Object.entries(pathAliases)) {
    if (request.startsWith(alias)) {
    const relativePath = request.replace(alias, replacement);
    const resolvedPath = resolveWithExtensions(path.resolve(options.basedir, relativePath));
    if (resolvedPath) return resolvedPath;
    }
}

// Handle imports with .ts extension
if (request.endsWith('.ts')) {
    const resolvedPath = resolveWithExtensions(path.resolve(options.basedir, request.replace(/\.ts$/, '')));
    if (resolvedPath) return resolvedPath;
}

// Try resolving with different extensions
const normalizedRequest = request.replace(/\.ts$/, '');
const resolvedPath = resolveWithExtensions(path.resolve(options.basedir, normalizedRequest));
if (resolvedPath) return resolvedPath;

// Fallback to default resolver
return options.defaultResolver(request, options);
};
