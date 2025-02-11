import { UserModel, UserDocument, UserFields } from '../models/User';
import { Identifier, UserRoles } from '../types/user';
import { InvalidArgumentError, DuplicateResourceError, ResourceNotFoundError } from '../utils/errors';

export class UserController {
private users: UserDocument[] = [];

async register(userData: UserFields): Promise<UserDocument> {
    const existingUser = this.users.find(user => user.email === userData.email);
    if (existingUser) {
    throw new DuplicateResourceError('Email already registered');
    }

    const userDataWithRole = {
    ...userData,
    role: userData.role || UserRoles.CUSTOMER,
    isActive: userData.isActive ?? true,
    firstName: userData.firstName || '',
    lastName: userData.lastName || ''
    };

    const newUser = new UserModel(userDataWithRole);
    this.users.push(newUser);
    return newUser;
}

async login(credentials: { email: string; password: string }): Promise<string> {
    const user = this.users.find(u => u.email === credentials.email);
    if (!user || !await user.verifyPassword(credentials.password)) {
    throw new InvalidArgumentError('Invalid login credentials');
    }
    return this.generateToken(user);
}

private generateToken(user: UserDocument): string {
    return `token_${user._id}`;
}

create(userData: UserFields = {}): UserDocument {
    const newUser = new UserModel({
    ...userData,
    role: userData.role || UserRoles.CUSTOMER,
    isActive: userData.isActive ?? true,
    firstName: userData.firstName || '',
    lastName: userData.lastName || ''
    });
    this.users.push(newUser);
    return newUser;
}

findById(id: Identifier): UserDocument | undefined {
    return this.users.find(user => user._id.toString() === id);
}

update(id: Identifier, userData: UserFields = {}): UserDocument | undefined {
    const userIndex = this.users.findIndex(user => user._id.toString() === id);
    
    if (userIndex !== -1) {
    this.users[userIndex] = new UserModel({
        ...this.users[userIndex].toObject(),
        ...userData,
        updatedAt: new Date()
    });
    
    return this.users[userIndex];
    }
    
    throw new ResourceNotFoundError('User not found');
}

delete(id: Identifier): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user._id.toString() !== id);
    return this.users.length < initialLength;
}
}
