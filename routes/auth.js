// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// GET registration page
router.get('/register', (req, res) => {
  res.sendFile('register.html', { root: './public' });
});

// POST registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });
    req.session.userId = user.id;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering new user.');
  }
});

// GET login page
router.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './public' });
});

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).send('User not found.');
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send('Incorrect password.');
    req.session.userId = user.id;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in.');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

module.exports = router;
