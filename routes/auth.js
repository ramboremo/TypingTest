const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  try {
    const { email, password, birthday, confirmPassword } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ msg: 'Passwords do not match' });
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User exists' });
    
    const user = new User({ email, password, birthday });
    await user.save();
    
    res.status(201).json({ msg: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) return res.status(400).json({ msg: 'Invalid credentials' });
    
    res.status(200).json({ msg: 'Login successful', email: email });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;