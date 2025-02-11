const Product = require('../models/Product');

class ProductService {
async createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
}

async getAllProducts(page, limit, filters = {}) {
    const query = {};
    
    if (filters.category) {
    query.category = filters.category;
    }

    if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    return await Product.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('seller', 'username email');
}

async getProductById(productId) {
    return await Product.findById(productId).populate('seller', 'username email');
}

async updateProduct(productId, updateData, user) {
    const product = await Product.findById(productId);

    if (!product) {
    throw new Error('Product not found');
    }

    // Ensure only the seller or admin can update the product
    if (product.seller.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new Error('Unauthorized to update this product');
    }

    Object.assign(product, updateData);
    return await product.save();
}

async deleteProduct(productId, user) {
    const product = await Product.findById(productId);

    if (!product) {
    throw new Error('Product not found');
    }

    // Ensure only the seller or admin can delete the product
    if (product.seller.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new Error('Unauthorized to delete this product');
    }

    return await Product.findByIdAndDelete(productId);
}
}

module.exports = new ProductService();

