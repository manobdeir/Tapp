import { describe, it, expect } from '@jest/globals';
import { productSchema } from '@/models/Product';

describe('Product Model Validation', () => {
it('should create a valid product with all required fields', () => {
    const productData = {
    name: 'Test Product',
    price: 99.99,
    category: 'Electronics',
    inventory: 10
    };

    const validationResult = productSchema.safeParse(productData);
    
    expect(validationResult.success).toBe(true);
    if (validationResult.success) {
    const product = validationResult.data;
    expect(product.name).toBe(productData.name);
    expect(product.price).toBe(productData.price);
    expect(product.category).toBe(productData.category);
    expect(product.inventory).toBe(productData.inventory);
    }
});

it('should require valid name, price, and category', () => {
    const invalidProductData = [
    { 
        name: '', 
        price: 100, 
        category: 'Electronics' 
    },
    { 
        name: 'Valid Product', 
        price: -10, 
        category: 'Electronics' 
    },
    { 
        name: 'Valid Product', 
        price: 100, 
        category: '' 
    }
    ];

    invalidProductData.forEach(data => {
    const validationResult = productSchema.safeParse(data);
    expect(validationResult.success).toBe(false);
    });
});

it('should have default inventory of 0 when not specified', () => {
    const minimalProductData = {
    name: 'Minimal Product',
    price: 49.99,
    category: 'Electronics'
    };

    const validationResult = productSchema.safeParse(minimalProductData);
    
    expect(validationResult.success).toBe(true);
    if (validationResult.success) {
    const product = validationResult.data;
    expect(product.inventory).toBe(0);
    }
});

it('should not allow prices less than or equal to zero', () => {
    const invalidPrices = [0, -10, -0.01];

    invalidPrices.forEach(price => {
    const invalidProductData = {
        name: 'Invalid Price Product',
        price: price,
        category: 'Test',
        inventory: 5
    };

    const validationResult = productSchema.safeParse(invalidProductData);
    expect(validationResult.success).toBe(false);
    });
});

it('should allow optional description', () => {
    const productWithDescription = {
    name: 'Described Product',
    price: 129.99,
    category: 'Electronics',
    description: 'A detailed product description',
    inventory: 20
    };

    const validationResult = productSchema.safeParse(productWithDescription);
    
    expect(validationResult.success).toBe(true);
    if (validationResult.success) {
    const product = validationResult.data;
    expect(product.description).toBe(productWithDescription.description);
    }
});
});

