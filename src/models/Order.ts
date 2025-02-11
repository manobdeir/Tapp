import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { Order, OrderStatus, OrderProduct, OrderShippingAddress } from '@/types/order';
import { Order, OrderStatus, OrderProduct, OrderShippingAddress } from '@/types/order';

export interface OrderDocument extends Omit<Order, '_id'>, Document {} 

const OrderSchema = new Schema<OrderDocument>({
userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
products: [{
    product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
    },
    quantity: {
    type: Number,
    required: true,
    min: 1
    },
    price: {
    type: Number,
    required: true
    }
}],
totalAmount: {
    type: Number,
    required: true,
    min: 0
},
status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
    required: true
},
shippingAddress: {
    street: {
    type: String,
    required: true
    },
    city: {
    type: String,
    required: true
    },
    state: {
    type: String,
    required: true
    },
    zipCode: {
    type: String,
    required: true
    },
    country: {
    type: String,
    required: true
    }
}
}, {
timestamps: true
});

export const OrderModel = mongoose.model<OrderDocument>('Order', OrderSchema);
export default OrderModel;

