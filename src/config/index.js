require('dotenv').config();

const config = {
PORT: process.env.PORT || 3000,
MONGODB_URI: process.env.MONGODB_URI,
JWT_SECRET: process.env.JWT_SECRET,
NODE_ENV: process.env.NODE_ENV || 'development',
JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1d'
};

module.exports = config;

