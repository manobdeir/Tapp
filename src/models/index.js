const mongoose = require('mongoose');

// User Model with enhanced features
const userSchema = new mongoose.Schema({
email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
},
password: { type: String, required: true },
userType: { 
    type: String, 
    enum: ['buyer', 'seller', 'admin'], 
    required: true 
},
name: { type: String, required: true },
profilePicture: String,
phoneNumber: String,
verificationStatus: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    documents: { type: Boolean, default: false }
},
// Seller specific fields
sellerProfile: {
    storeName: String,
    description: String,
    logo: String,
    bannerImage: String,
    businessAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
    },
    businessRegistration: {
    number: String,
    document: String,
    verified: { type: Boolean, default: false }
    },
    ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
    },
    categories: [String],
    shippingMethods: [{
    name: String,
    price: Number,
    estimatedDays: String
    }]
},
// Buyer specific fields
buyerProfile: {
    shippingAddresses: [{
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
    }],
    paymentMethods: [{
    type: String,
    last4: String,
    expiryMonth: Number,
    expiryYear: Number,
    isDefault: Boolean
    }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
},
// Common fields
notifications: [{
    type: String,
    message: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}],
settings: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    twoFactorAuth: { type: Boolean, default: false }
},
lastLogin: Date,
loginHistory: [{
    date: Date,
    ip: String,
    device: String
}],
status: {
    type: String,
    enum: ['active', 'suspended', 'banned'],
    default: 'active'
}
}, {
timestamps: true
});

// Product Model with enhanced features
const productSchema = new mongoose.Schema({
seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
title: { 
    type: String, 
    required: true,
    index: true 
},
slug: {
    type: String,
    unique: true
},
description: { 
    type: String, 
    required: true 
},
price: { 
    type: Number, 
    required: true,
    min: 0 
},
compareAtPrice: Number,
category: {
    main: { type: String, required: true },
    sub: String
},
images: [{
    url: String,
    alt: String,
    order: Number
}],
variants: [{
    name: String,
    options: [{
    value: String,
    price: Number,
    stock: Number,
    sku: String
    }]
}],
attributes: [{
    name: String,
    value: String
}],
stock: {
    type: Number,
    required: true,
    min: 0
},
sku: String,
barcode: String,
weight: Number,
dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: String
},
shipping: {
    free: Boolean,
    methods: [{
    name: String,
    price: Number,
    estimatedDays: String
    }]
},
ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    details: [{
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    review: String,
    images: [String],
    helpful: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
    }]
},
status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'deleted'],
    default: 'draft'
},
seo: {
    title: String,
    description: String,
    keywords: [String]
},
analytics: {
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
}
}, {
timestamps: true
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

module.exports = {
User,
Product
};

