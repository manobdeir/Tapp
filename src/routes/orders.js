const express = require('express');
const router = express.Router();

// Create order
router.post('/', async (req, res) => {
try {
    res.status(201).json({ message: 'Order created' });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

// Get order history
router.get('/', async (req, res) => {
try {
    res.json({ message: 'Order history' });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

// Get order by ID
router.get('/:id', async (req, res) => {
try {
    res.json({ message: `Get order ${req.params.id}` });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

module.exports = router;

