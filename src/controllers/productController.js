const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
try {
    const { name, description, price, category, stock } = req.body;
    
    const product = new Product({
    name,
    description,
    price,
    category,
    stock,
    seller: req.user.id
    });

    await product.save();
    res.status(201).json(product);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Get all products
exports.getProducts = async (req, res) => {
try {
    const { category, minPrice, maxPrice } = req.query;
    let query = {};

    if (category) query.category = category;
    if (minPrice) query.price = { $gte: minPrice };
    if (maxPrice) query.price = { ...query.price, $lte: maxPrice };

    const products = await Product.find(query).populate('seller', 'username');
    res.json(products);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Get product by ID
exports.getProductById = async (req, res) => {
try {
    const product = await Product.findById(req.params.id).populate('seller', 'username');
    
    if (!product) {
    return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Update product
exports.updateProduct = async (req, res) => {
try {
    const { name, description, price, category, stock } = req.body;
    
    const product = await Product.findOneAndUpdate(
    { _id: req.params.id, seller: req.user.id },
    { name, description, price, category, stock },
    { new: true, runValidators: true }
    );

    if (!product) {
    return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    res.json(product);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Delete product
exports.deleteProduct = async (req, res) => {
try {
    const product = await Product.findOneAndDelete({ 
    _id: req.params.id, 
    seller: req.user.id 
    });

    if (!product) {
    return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    res.json({ message: 'Product deleted successfully' });
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

