const express = require('express');
const router = express.Router();
const { 
createTransaction, 
getUserTransactions, 
getTransactionById, 
updateTransactionStatus 
} = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.post('/', authMiddleware, createTransaction);
router.get('/', authMiddleware, getUserTransactions);
router.get('/:id', authMiddleware, getTransactionById);
router.put('/:id/status', authMiddleware, updateTransactionStatus);

module.exports = router;

