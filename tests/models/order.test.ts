import { OrderModel } from '@/models/Order';
import { ProductModel } from '@/models/Product';
import { InvalidArgumentError } from '@/utils/errors';
import type { Product } from '@/types/product';
import { OrderStatus } from '@/types/order';
describe('Order Model', () => {
let product: Product;

beforeEach(() => {
    product = new ProductModel({
    name: 'Test Product',
    price: 49.99,
    category: 'Electronics',
    inventory: 100
    });
});

describe('Order Creation', () => {
    it('should create a valid order', () => {
    const orderData = {
        userId: 'user123',
        products: [{ product, quantity: 2 }],
        totalPrice: 99.98
    };
    const order = new OrderModel(orderData);
    expect(order).toBeDefined();
    expect(order.products[0].quantity).toBe(2);
    });

    it('should prevent order with zero or negative quantity', () => {
    expect(() => new OrderModel({
        userId: 'user123',
        products: [{ product, quantity: 0 }],
        totalPrice: 0
    })).toThrow(InvalidArgumentError);

    expect(() => new OrderModel({
        userId: 'user123',
        products: [{ product, quantity: -1 }],
        totalPrice: 0
    })).toThrow(InvalidArgumentError);
    });

    it('should calculate total price correctly', () => {
    const order = new OrderModel({
        userId: 'user123',
        products: [
        { product, quantity: 2 },
        { product: new ProductModel({ name: 'Another Product', price: 25.50, category: 'Accessories', inventory: 50 }), quantity: 1 }
        ],
        totalPrice: 175
    });
    expect(order.totalPrice).toBe(175);
    });
});

describe('Order Status Management', () => {
    it('should support different order statuses', () => {
    const statuses = Object.values(OrderStatus);
    statuses.forEach(status => {
        const order = new OrderModel({
        userId: 'user123',
        products: [{ product, quantity: 1 }],
        totalPrice: 49.99,
        status,
        });
        expect(order.status).toBe(status);
    });
    });
});
});

