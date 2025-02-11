import { Request, Response } from 'express';
import { ProductService } from '@/services/ProductService';
import { Product, ProductInput, ProductOutput, productSchema } from '@/models/Product';
import { z } from 'zod';
import { ResourceNotFoundError } from '@/utils/errors';

export class ProductController {
    private productService: ProductService;

    constructor(productService?: ProductService) {
        this.productService = productService || new ProductService();
    }

    async createProduct(req: Request, res: Response): Promise<void> {
        try {
            const productData: ProductInput = productSchema.parse(req.body);
            const newProduct = await this.productService.createProduct(productData);
            res.status(201).json(newProduct);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ 
                    error: 'Validation failed', 
                    details: error.errors 
                });
            } else if (error instanceof Error) {
                res.status(400).json({ 
                    error: 'Product creation failed', 
                    message: error.message 
                });
            } else {
                res.status(500).json({ error: 'Unexpected error during product creation' });
            }
        }
    }

    async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.max(1, Number(req.query.limit) || 10);
                
            const products = await this.productService.listProducts({ page, limit });
            res.status(200).json(products);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ 
                    error: 'Failed to retrieve products', 
                    message: error.message 
                });
            } else {
                res.status(500).json({ error: 'Unexpected error retrieving products' });
            }
        }
    }

    async getProductById(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.id;
            const product = await this.productService.getProductById(productId);
            
            if (!product) {
                throw new ResourceNotFoundError('Product not found');
            }

            res.status(200).json(product);
            res.status(200).json(product);
        } catch (error) {
            if (error instanceof ResourceNotFoundError) {
                res.status(404).json({ 
                    error: error.message,
                    productId: req.params.id
                });
            } else if (error instanceof Error) {
                res.status(500).json({ 
                    error: 'Failed to retrieve product', 
                    message: error.message 
                });
            } else {
                res.status(500).json({ error: 'Unexpected error retrieving product' });
            }
        }
    }

    async updateProduct(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.id;
            const updateData = productSchema.partial().parse(req.body);
            
            const validatedData = {
                name: updateData.name ?? undefined,
                price: updateData.price ?? undefined,
                category: updateData.category ?? undefined,
                description: updateData.description,
                inventory: updateData.inventory
            };
            
            const updatedProduct = await this.productService.updateProduct(productId, validatedData);
            
            if (!updatedProduct) {
                throw new ResourceNotFoundError('Product not found');
            }

            res.status(200).json(updatedProduct);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ 
                    error: 'Validation failed', 
                    details: error.errors 
                });
            } else if (error instanceof ResourceNotFoundError) {
                res.status(404).json({ 
                    error: error.message,
                    productId: req.params.id
                });
            } else if (error instanceof Error) {
                res.status(400).json({ 
                    error: 'Product update failed', 
                    message: error.message 
                });
            } else {
                res.status(500).json({ error: 'Unexpected error during product update' });
            }
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.id;
            const deletedProduct = await this.productService.deleteProduct(productId);

            if (!deletedProduct) {
                throw new ResourceNotFoundError('Product not found');
            }

            res.status(200).json({ 
                message: 'Product successfully deleted', 
                product: deletedProduct 
            });
        } catch (error) {
            if (error instanceof ResourceNotFoundError) {
                res.status(404).json({ 
                    error: error.message,
                    productId: req.params.id
                });
            } else if (error instanceof Error) {
                res.status(500).json({ 
                    error: 'Failed to delete product', 
                    message: error.message 
                });
            } else {
                res.status(500).json({ error: 'Unexpected error during product deletion' });
            }
        }
    }
}
