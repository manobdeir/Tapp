import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRoles, UserRole } from '@/types/user';


export interface UserDocument extends mongoose.Document<mongoose.Types.ObjectId, {}, User>, User, UserMethods {
_id: mongoose.Types.ObjectId;
}

const userSchemaFields = {
username: {
    type: String,
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
},
email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
},
password: {
    type: String,
    required: true
},
firstName: {
    type: String,
    required: true
},
lastName: {
    type: String,
    required: true  
},
role: {
    type: String as mongoose.SchemaDefinitionProperty<UserRole>,
    enum: Object.values(UserRoles),
    default: UserRoles.USER,
    required: true
},
isActive: {
    type: Boolean,
    default: true,
    required: true,
    validate: {
    validator: function(v: boolean): boolean {
        return typeof v === 'boolean';
    },
    message: 'isActive must be a boolean value'
    }
}
};

const UserSchema = new mongoose.Schema<UserDocument>(userSchemaFields, {
timestamps: true,
toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc: UserDocument, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
    }
}
});
}, {
timestamps: true
});

UserSchema.pre('save', async function(next) {
if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
}
next();
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.verifyPassword = async function(candidatePassword: string): Promise<boolean> {
return this.comparePassword(candidatePassword);
};
UserSchema.virtual('id').get(function(this: UserDocument): string {
    return this._id.toString();
});

UserSchema.set('toObject', { getters: true });

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
export default UserModel;
