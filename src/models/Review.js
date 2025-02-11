const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
reviewer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
},
rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
},
comment: { 
    type: String, 
    trim: true 
},
helpful: { 
    type: Number, 
    default: 0 
},
createdAt: { 
    type: Date, 
    default: Date.now 
}
}, {
timestamps: true
});

// Indexing for better query performance
reviewSchema.index({ product: 1, rating: 1 });
reviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);

