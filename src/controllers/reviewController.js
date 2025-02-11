const Review = require('../models/Review');
const Product = require('../models/Product');

// Create a review
exports.createReview = async (req, res) => {
try {
    const { productId, rating, comment } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
    return res.status(404).json({ message: 'Product not found' });
    }

    const review = new Review({
    user: req.user.id,
    product: productId,
    rating,
    comment
    });

    await review.save();
    res.status(201).json(review);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Get product reviews
exports.getProductReviews = async (req, res) => {
try {
    const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'username');
    
    res.json(reviews);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Update a review
exports.updateReview = async (req, res) => {
try {
    const { rating, comment } = req.body;
    
    const review = await Review.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { rating, comment },
    { new: true }
    );

    if (!review) {
    return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    res.json(review);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Delete a review
exports.deleteReview = async (req, res) => {
try {
    const review = await Review.findOneAndDelete({ 
    _id: req.params.id, 
    user: req.user.id 
    });

    if (!review) {
    return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    res.json({ message: 'Review deleted successfully' });
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

