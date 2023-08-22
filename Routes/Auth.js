const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User.model');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

// User registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, dateOfBirth } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, name, dateOfBirth });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userResponse = {
      token,
      username: user.username,
      name: user.name,
      dateOfBirth: user.dateOfBirth,
      userId: user._id,
      followers: user.followers,
    };
    res.status(200).json(userResponse);

    await user.save();
    
 
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});
router.post('/logout', async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token);
    await req.user.save();
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;
