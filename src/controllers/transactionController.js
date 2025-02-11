const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

// Create a new transaction
exports.createTransaction = async (req, res) => {
try {
    const { productId, quantity } = req.body;
    
    // Find product and check stock
    const product = await Product.findById(productId);
    if (!product) {
    return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
    return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Create transaction
    const transaction = new Transaction({
    buyer: req.user.id,
    product: productId,
    seller: product.seller,
    quantity,
    totalPrice: product.price * quantity
    });

    // Update product stock
    product.stock -= quantity;
    await product.save();

    await transaction.save();
    res.status(201).json(transaction);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Get user's transactions
exports.getUserTransactions = async (req, res) => {
try {
    const transactions = await Transaction.find({ buyer: req.user.id })
    .populate('product')
    .populate('seller', 'username')
    .populate('buyer', 'username');
    
    res.json(transactions);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
try {
    const transaction = await Transaction.findOne({ 
    _id: req.params.id, 
    buyer: req.user.id 
    })
    .populate('product')
    .populate('seller', 'username')
    .populate('buyer', 'username');

    if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Update transaction status
exports.updateTransactionStatus = async (req, res) => {
try {
    const { status } = req.body;
    
    const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, seller: req.user.id },
    { status },
    { new: true }
    );

    if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    res.json(transaction);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

