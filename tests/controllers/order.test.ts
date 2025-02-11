import { OrderController } from '@/controllers/OrderController';
import { UserModel } from '@/models/User';
import { ProductModel } from '@/models/Product';
import type { User } from '@/types/user';
import type { Product } from '@/types/product';
import { OrderStatus } from '@/types/order';
import { UserRoles } from '@/types/user';
describe('OrderController', () => {
let orderController: OrderController;
let user: User;
let product: Product;

beforeEach(() => {
    orderController = new OrderController();
    user = new UserModel({
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPassword123!',
        role: UserRoles.CUSTOMER
    });
    product = new ProductModel({
        name: 'Test Product',
        price: 49.99,
        category: 'Electronics',
        inventory: 100
    });
});

describe('Order Placement', () => {
    it('should create an order successfully', async () => {
    const orderData = {
        userId: user.id,
        products: [{ product, quantity: 2 }]
    };

    const createdOrder = await orderController.createOrder(orderData);
    expect(createdOrder).toBeDefined();
    expect(createdOrder.products[0].quantity).toBe(2);
    });

    it('should reduce product inventory when order is placed', async () => {
    const initialInventory = product.inventory;
    const orderData = {
        userId: user.id,
        products: [{ product, quantity: 10 }]
    };

    await orderController.createOrder(orderData);
    expect(product.inventory).toBe(initialInventory - 10);
    });

    it('should prevent order with insufficient inventory', async () => {
    const orderData = {
        userId: user.id,
        products: [{ product, quantity: 200 }]
    };

    await expect(orderController.createOrder(orderData)).rejects.toThrow('Insufficient inventory');
    });
});

describe('Order Retrieval', () => {
    it('should retrieve user orders', async () => {
    const orders = await orderController.getUserOrders(user.id);
    expect(Array.isArray(orders)).toBeTruthy();
    });
});
});

