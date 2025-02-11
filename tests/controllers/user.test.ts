import { UserController } from '@/controllers/UserController';
import { InvalidArgumentError } from '@/utils/errors';
import { UserRoles, UserRole } from '@/types/user';

describe('UserController', () => {
let userController: UserController;

beforeEach(() => {
    userController = new UserController();
});

describe('User Registration', () => {
    it('should register a new user successfully', async () => {
    const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'StrongPassword123!',
        role: UserRoles.CUSTOMER
    };

    const registeredUser = await userController.register(userData);
    expect(registeredUser).toBeDefined();
    expect(registeredUser.username).toBe(userData.username);
    });

    it('should prevent duplicate email registration', async () => {
    const userData = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'StrongPassword123!',
        role: UserRoles.CUSTOMER
    };

    await userController.register(userData);
    await expect(userController.register(userData)).rejects.toThrow('Email already registered');
    });
});

describe('User Authentication', () => {
    it('should authenticate user with correct credentials', async () => {
    const userData = {
        username: 'authuser',
        email: 'auth@example.com',
        password: 'ValidPassword123!',
        role: UserRoles.CUSTOMER
    };

    await userController.register(userData);
    const token = await userController.login({
        email: userData.email,
        password: userData.password
    });

    expect(token).toBeDefined();
    });

    it('should reject login with incorrect credentials', async () => {
    await expect(userController.login({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
    })).rejects.toThrow(InvalidArgumentError);
    });
});
});

