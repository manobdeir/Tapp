const express = require('express');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
try {
    res.json({ message: 'List all products' });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

// Create product
router.post('/', async (req, res) => {
try {
    res.status(201).json({ message: 'Product created' });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

// Get product by ID
router.get('/:id', async (req, res) => {
try {
    res.json({ message: `Get product ${req.params.id}` });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

module.exports = router;

