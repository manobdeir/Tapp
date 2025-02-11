import mongoose from 'mongoose';

export const UserRoles = {
USER: 'user',
SELLER: 'seller', 
ADMIN: 'admin',
CUSTOMER: 'customer'
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];

export interface User {
_id?: mongoose.Types.ObjectId;
id?: string;  // Virtual field
username: string;
email: string;
password: string;
firstName: string;
lastName: string;
role: UserRole;
isActive: boolean;
createdAt: Date;
updatedAt: Date;
}

export interface UserMethods {
comparePassword(candidatePassword: string): Promise<boolean>;
verifyPassword(candidatePassword: string): Promise<boolean>;
}

export type UserIdentifier = string | undefined;
export type Identifier = UserIdentifier;
