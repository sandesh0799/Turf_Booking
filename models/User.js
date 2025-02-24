// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,  // Ensure that the username is unique
    },
    password: {
        type: String,
        required: true,  // Password is required
    },
    role: {
        type: String,
        enum: ['USER','ADMIN'],  // Can either be 'user' or 'admin'
        default: 'USER',  // Default role is 'user'
    },
}, { timestamps: true });  // Add createdAt and updatedAt timestamps

// Method to hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();  // Skip hashing if password is not modified
    }

    const salt = await bcrypt.genSalt(10);  // Generate a salt
    this.password = await bcrypt.hash(this.password, salt);  // Hash the password
    next();
});

// Method to compare entered password with stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);  // Compare password
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
