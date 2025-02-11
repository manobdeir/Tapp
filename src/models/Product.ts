import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';
import { InvalidArgumentError } from '@/utils/errors';

export enum ProductCategory {
Electronics = 'Electronics',
Clothing = 'Clothing',
Books = 'Books',
Home = 'Home',
Other = 'Other'
}

export const productSchema = z.object({
name: z.string().trim().min(3, 'Product name must be at least 3 characters long').max(100, 'Product name cannot exceed 100 characters'),
description: z.string().trim().min(10, 'Description must be at least 10 characters long').max(500, 'Description cannot exceed 500 characters').optional(),
price: z.number().positive('Price must be greater than zero').max(1000000, 'Price is too high'),
category: z.nativeEnum(ProductCategory, { 
    errorMap: () => ({ message: 'Category must be a valid product category' }) 
}),
inventory: z.number().int().min(0, 'Inventory cannot be negative').max(10000, 'Inventory exceeds maximum limit').optional().default(0),
createdAt: z.date().default(() => new Date()),
updatedAt: z.date().default(() => new Date())
});

export type ProductInput = z.input<typeof productSchema>;
export type ProductOutput = z.output<typeof productSchema>;
export type IProduct = ProductOutput & Document;

const MongooseProductSchema: Schema<IProduct> = new Schema<IProduct>({
name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters long'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
},
description: {
    type: String,
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [500, 'Description cannot exceed 500 characters']
},
price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0.01, 'Price must be greater than zero'],
    max: [1000000, 'Price is too high']
},
category: {
    type: String,
    enum: {
    values: Object.values(ProductCategory),
    message: 'Invalid product category'
    },
    required: [true, 'Product category is required']
},
inventory: {
    type: Number,
    min: [0, 'Inventory cannot be negative'],
    max: [10000, 'Inventory exceeds maximum limit'],
    default: 0
},
createdAt: {
    type: Date,
    default: Date.now
},
updatedAt: {
    type: Date,
    default: Date.now
}
}, {
timestamps: true
});

MongooseProductSchema.pre('save', function(next) {
try {
    productSchema.parse(this.toObject());
    next();
} catch (error) {
    next(new InvalidArgumentError('Invalid product data'));
}
});

export const Product = mongoose.model<IProduct>('Product', MongooseProductSchema);

export type ProductModel = typeof Product & { 
safeParse: (data: unknown) => z.SafeParseReturnType<typeof productSchema, ProductOutput>;
schema: typeof productSchema;
};

export const ProductModel = Object.assign(Product, { 
safeParse: (data: unknown) => productSchema.safeParse(data), 
schema: productSchema 
});
