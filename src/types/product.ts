import { ProductCategory } from '../models/Product';

export interface Product {
id?: string;
name: string;
description?: string;
price: number;
category: ProductCategory;
inventory: number;
createdAt?: Date;
updatedAt?: Date;
}

