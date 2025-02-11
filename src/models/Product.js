const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
title: { 
    type: String, 
    required: true, 
    trim: true 
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
category: { 
    type: String, 
    required: true 
},
condition: { 
    type: String, 
    enum: ['New', 'Like New', 'Very Good', 'Good', 'Acceptable'], 
    default: 'New' 
},
images: [{ 
    type: String 
}],
stock: { 
    type: Number, 
    default: 1 
},
tags: [{ 
    type: String 
}],
status: { 
    type: String, 
    enum: ['Active', 'Sold', 'Inactive'], 
    default: 'Active' 
},
createdAt: { 
    type: Date, 
    default: Date.now 
},
updatedAt: { 
    type: Date, 
    default: Date.now 
}
}, {
timestamps: true
});

// Indexing for better query performance
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);

