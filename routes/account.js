// routes/account.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware for authentication
function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/auth/login');
}

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    res.send(`
      <h1>Account Settings</h1>
      <form method="POST" action="/account">
        <label>UPI ID:</label>
        <input type="text" name="upiId" value="${user.upiId || ''}" /><br/>
        <label>Bank Account Number:</label>
        <input type="text" name="accountNumber" value="${user.accountNumber || ''}" /><br/>
        <label>IFSC:</label>
        <input type="text" name="ifsc" value="${user.ifsc || ''}" /><br/>
        <label>Alert Sound:</label>
        <input type="text" name="alertSound" value="${user.alertSound || 'default'}" /><br/>
        <label>Alert Duration (seconds):</label>
        <input type="number" name="alertDuration" value="${user.alertDuration || 5}" /><br/>
        <button type="submit">Save</button>
      </form>
      <a href="/dashboard">Back to Dashboard</a>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading account settings.');
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  const { upiId, accountNumber, ifsc, alertSound, alertDuration } = req.body;
  try {
    const user = await User.findByPk(req.session.userId);
    user.upiId = upiId;
    user.accountNumber = accountNumber;
    user.ifsc = ifsc;
    user.alertSound = alertSound;
    user.alertDuration = alertDuration;
    await user.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving account settings.');
  }
});

module.exports = router;
