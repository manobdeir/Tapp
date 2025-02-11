const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
name: {
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
seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
imageUrls: [{
    type: String
}],
stockQuantity: {
    type: Number,
    default: 0,
    min: 0
},
isActive: {
    type: Boolean,
    default: true
}
}, {
timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);

