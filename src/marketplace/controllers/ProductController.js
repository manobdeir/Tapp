const ProductService = require('../services/ProductService');
const { validationResult } = require('express-validator');

class ProductController {
async createProduct(req, res) {
    try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const productData = {
        ...req.body,
        seller: req.user._id
    };

    const product = await ProductService.createProduct(productData);
    res.status(201).json(product);
    } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
    }
}

async getAllProducts(req, res) {
    try {
    const { page = 1, limit = 10, category, minPrice, maxPrice } = req.query;
    const products = await ProductService.getAllProducts(page, limit, { category, minPrice, maxPrice });
    res.json(products);
    } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
}

async getProductById(req, res) {
    try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
    } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
}

async updateProduct(req, res) {
    try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const product = await ProductService.updateProduct(req.params.id, req.body, req.user);
    res.json(product);
    } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
    }
}

async deleteProduct(req, res) {
    try {
    await ProductService.deleteProduct(req.params.id, req.user);
    res.status(204).send();
    } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
}
}

module.exports = new ProductController();

