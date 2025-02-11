const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const ROLES = require('../config/roles');

const userSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true, trim: true },
email: { type: String, required: true, unique: true, lowercase: true },
password: { type: String, required: true },
role: { 
    type: String, 
    enum: Object.values(ROLES), 
    default: ROLES.BUYER 
},
profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    profilePicture: { type: String },
    bio: { type: String, maxlength: 500 }
},
passwordResetToken: { type: String },
passwordResetExpires: { type: Date },
isActive: { type: Boolean, default: true },
lastLogin: { type: Date }
}, { 
timestamps: true 
});

// Hash password before saving
userSchema.pre('save', async function(next) {
if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
}

// Ensure a role is assigned
if (!this.role) {
    this.role = ROLES.BUYER;
}

next();
});

// Method to compare password
// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate password reset token
userSchema.methods.createPasswordResetToken = function() {
const resetToken = crypto.randomBytes(32).toString('hex');

this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

// Token expires in 10 minutes
this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

return resetToken;
};

// Method to check if user has specific role
userSchema.methods.hasRole = function(role) {
return this.role === role;
};

module.exports = mongoose.model('User', userSchema);
