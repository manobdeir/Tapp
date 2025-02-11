const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
console.error(`[ERROR] ${err.name}: ${err.message}`);
console.error(err.stack);

const statusCode = err.statusCode || 500;
res.status(statusCode).json({
    success: false,
    error: {
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
});
};

module.exports = errorHandler;

