const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
},
lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
},
email: {
    type: String,
    required: [true, 'Valid email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
},
password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
},
createdAt: {
    type: Date,
    default: Date.now
}
});

userSchema.pre('save', async function(next) {
if (!this.isModified('password')) {
    return next();
}
try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
} catch (error) {
    next(error);
}
});

userSchema.methods.comparePassword = async function(candidatePassword) {
return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
const user = this.toObject();
delete user.password;
return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
