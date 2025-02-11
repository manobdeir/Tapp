import { InvalidArgumentError } from '@/utils/errors';
import { UserModel } from '@/models/User';
import { UserRoles, UserRole } from '@/types/user';

describe('User Model', () => {
describe('User Creation', () => {
    it('should create a valid user', () => {
    const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePassword123!',
        role: UserRoles.CUSTOMER
    };
    const user = new UserModel(userData);
    expect(user).toBeDefined();
    expect(user.username).toBe(userData.username);
    });

    it('should enforce email validation', () => {
    const invalidEmails = ['invalid-email', 'missing@', '@domain.com'];
    invalidEmails.forEach(email => {
        expect(() => new UserModel({
        username: 'testuser',
        email,
        password: 'ValidPassword123!',
        role: UserRoles.CUSTOMER
        })).toThrow(InvalidArgumentError);
    });
    });

    it('should enforce strong password requirements', () => {
    const weakPasswords = ['short', 'no_uppercase', 'NO_LOWERCASE123'];
    weakPasswords.forEach(password => {
        expect(() => new UserModel({
        username: 'testuser',
        email: 'test@example.com',
        password,
        role: UserRoles.CUSTOMER
        })).toThrow(InvalidArgumentError);
    });
    });

    it('should support different user roles', () => {
    const roles = [UserRoles.CUSTOMER, UserRoles.SELLER, UserRoles.ADMIN];
    roles.forEach(role => {
        const user = new UserModel({
        username: `${role}user`,
        email: `${role}@example.com`,
        password: 'ValidPassword123!',
        role
        });
        expect(user.role).toBe(role);
    });
    });
});

describe('User Authentication', () => {
    it('should verify password correctly', () => {
    const password = 'ValidPassword123!';
    const user = new UserModel({
        username: 'authuser',
        email: 'auth@example.com',
        password,
        role: UserRoles.CUSTOMER
    });

    expect(user.verifyPassword(password)).toBeTruthy();
    expect(user.verifyPassword('wrongpassword')).toBeFalsy();
    });
});
});

