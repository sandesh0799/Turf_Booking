// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Create new user
        const newUser = new User({
            username,
            password,
            role: role || 'USER',  // Default to 'user' if no role is specified
        });

        // Save the user
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },  // Include user ID and role in the token payload
            process.env.JWT_SECRET,  // Secret key from environment
            { expiresIn: '1h' }  // Token expires in 1 hour
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/turf', async (req, res) => {
    try {
        res.json({ turf: [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;
