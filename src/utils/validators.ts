import { z } from 'zod';

export const productValidationSchema = z.object({
name: z.string().min(2, { message: "Product name must be at least 2 characters long" }).max(100, { message: "Product name cannot exceed 100 characters" }),
description: z.string().optional(),
price: z.number().positive({ message: "Price must be a positive number" }),
category: z.string().min(2, { message: "Category must be at least 2 characters long" }),
inventory: z.number().int().nonnegative({ message: "Inventory must be a non-negative integer" }),
isActive: z.boolean().optional().default(true)
});

export function validateProduct(data: unknown) {
return productValidationSchema.parse(data);
}

export function isValidProduct(data: unknown): boolean {
try {
    productValidationSchema.parse(data);
    return true;
} catch {
    return false;
}
}

