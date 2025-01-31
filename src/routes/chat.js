const express = require('express');
const router = express.Router();

// Get chat history
router.get('/history/:userId', async (req, res) => {
try {
    res.json({ message: `Chat history for user ${req.params.userId}` });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

// Get active chats
router.get('/active', async (req, res) => {
try {
    res.json({ message: 'Active chats' });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

module.exports = router;

