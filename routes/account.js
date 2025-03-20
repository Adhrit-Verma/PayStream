// routes/account.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AlertSettings = require('../models/AlertSettings');

function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/auth/login');
}

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId, { include: 'alertSettings' });
    const settings = user.alertSettings || {};
    res.send(`
      <h1>Account Settings</h1>
      <form method="POST" action="/account">
        <label>UPI ID:</label>
        <input type="text" name="upiId" value="${user.upiId || ''}" /><br/>
        <label>Bank Account Number:</label>
        <input type="text" name="accountNumber" value="${user.accountNumber || ''}" /><br/>
        <label>IFSC:</label>
        <input type="text" name="ifsc" value="${user.ifsc || ''}" /><br/>
        <label>Custom Alert Message:</label>
        <input type="text" name="customMessage" value="${settings.customMessage || ''}" /><br/>
        <label>Overlay Position:</label>
        <input type="text" name="overlayPosition" value="${settings.overlayPosition || ''}" /><br/>
        <label>Alert Sound:</label>
        <input type="text" name="alertSound" value="${settings.alertSound || 'default'}" /><br/>
        <label>Alert Duration (seconds):</label>
        <input type="number" name="alertDuration" value="${settings.alertDuration || 5}" /><br/>
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
  const { upiId, accountNumber, ifsc, customMessage, overlayPosition, alertSound, alertDuration } = req.body;
  try {
    const user = await User.findByPk(req.session.userId);
    // Update user basic details
    user.upiId = upiId;
    user.accountNumber = accountNumber;
    user.ifsc = ifsc;
    await user.save();

    // Update or create alert settings
    let settings = await AlertSettings.findOne({ where: { userId: user.id } });
    if (settings) {
      settings.customMessage = customMessage;
      settings.overlayPosition = overlayPosition;
      settings.alertSound = alertSound;
      settings.alertDuration = alertDuration;
      await settings.save();
    } else {
      settings = await AlertSettings.create({
        userId: user.id,
        customMessage,
        overlayPosition,
        alertSound,
        alertDuration
      });
    }
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving account settings.');
  }
});

module.exports = router;
