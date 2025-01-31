const express = require('express');
const router = express.Router();

// Get sales analytics
router.get('/sales', async (req, res) => {
try {
    res.json({ message: 'Sales analytics' });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

// Get user analytics
router.get('/users', async (req, res) => {
try {
    res.json({ message: 'User analytics' });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

module.exports = router;

