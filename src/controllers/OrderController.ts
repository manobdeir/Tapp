import { OrderModel, OrderFields, OrderProduct } from '../models/Order.js';
import { Identifier, OrderStatus } from '../types/order.js';
import { ProductModel } from '../models/Product.js';
import { UserModel } from '../models/User.js';
import { InvalidArgumentError, InsufficientInventoryError } from '../utils/errors.js';

export class OrderController {
    private orders: OrderModel[] = [];

    async createOrder(orderData: Partial<OrderFields>): Promise<OrderModel> {
        if (!orderData.products || orderData.products.length === 0) {
            throw new InvalidArgumentError('Order must contain at least one product');
        }

        // Validate inventory for all products
        for (const product of orderData.products) {
            if (product.product.inventory < product.quantity) {
                throw new InsufficientInventoryError(`Insufficient inventory for product ${product.product.id}`);
            }
        }

        const newOrder = OrderModel.create({
            ...orderData,
            status: OrderStatus.PENDING
        });
        this.orders.push(newOrder);
        return newOrder;
    }

    findById(id: Identifier): OrderModel | undefined {
        return this.orders.find(order => order.id === id);
    }

    getUserOrders(userId: Identifier): OrderModel[] {
        return this.orders.filter(order => order.userId === userId);
    }

    create(orderData: Partial<OrderFields> = {}): OrderModel {
        const newOrder = OrderModel.create(orderData);
        this.orders.push(newOrder);
        return newOrder;
    }
}

// Remove duplicate method definitions here
        throw new InvalidArgumentError('Cannot update status of cancelled or completed orders');
    }
    
    order.status = status;
    order.updatedAt = new Date();
    
    return order;
}
}
