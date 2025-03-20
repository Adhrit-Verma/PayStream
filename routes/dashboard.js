// routes/dashboard.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/auth/login');
}

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ where: { userId: req.session.userId } });
    const totalEarnings = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    res.send(`
      <h1>Dashboard</h1>
      <p>Total Earnings: ₹${totalEarnings}</p>
      <a href="/account">Account Settings</a>
      <a href="/auth/logout">Logout</a>
      <script src="/main.js"></script>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading dashboard.');
  }
});

module.exports = router;
