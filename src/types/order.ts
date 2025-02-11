import { Types } from 'mongoose';

export enum OrderStatus {
PENDING = 'pending',
PROCESSING = 'processing',
SHIPPED = 'shipped',
DELIVERED = 'delivered',
CANCELLED = 'cancelled'
}

export interface OrderProduct {
product: Types.ObjectId;
quantity: number;
price?: number;
}

export interface OrderShippingAddress {
street: string;
city: string;
state: string;
zipCode: string;
country: string;
phone?: string;
}

export interface Order {
_id?: Types.ObjectId;
userId: Types.ObjectId;
products: OrderProduct[];
totalAmount: number;
status: OrderStatus;
shippingAddress?: OrderShippingAddress;
createdAt?: Date;
updatedAt?: Date;
}
