const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

// Validation middleware for product creation
const createProductValidation = [
body('name').notEmpty().withMessage('Product name is required'),
body('description').notEmpty().withMessage('Description is required'),
body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
body('category').notEmpty().withMessage('Category is required')
];

// Product Routes
router.post(
'/', 
authMiddleware.authenticate,
createProductValidation, 
ProductController.createProduct
);

router.get(
'/', 
ProductController.getAllProducts
);

router.get(
'/:id', 
param('id').isMongoId().withMessage('Invalid product ID'),
ProductController.getProductById
);

router.put(
'/:id', 
authMiddleware.authenticate,
createProductValidation,
param('id').isMongoId().withMessage('Invalid product ID'),
ProductController.updateProduct
);

router.delete(
'/:id', 
authMiddleware.authenticate,
param('id').isMongoId().withMessage('Invalid product ID'),
ProductController.deleteProduct
);

module.exports = router;

