const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
buyer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
},
quantity: { 
    type: Number, 
    required: true, 
    min: 1 
},
totalPrice: { 
    type: Number, 
    required: true, 
    min: 0 
},
status: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Cancelled', 'Refunded'], 
    default: 'Pending' 
},
paymentMethod: { 
    type: String, 
    required: true 
},
shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
},
trackingNumber: { 
    type: String 
},
createdAt: { 
    type: Date, 
    default: Date.now 
}
}, {
timestamps: true
});

// Indexing for better query performance
transactionSchema.index({ buyer: 1, seller: 1, status: 1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);

