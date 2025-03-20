// routes/razorpay.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Transaction = require('../models/Transaction');

// Initialize Razorpay instance with your credentials
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Endpoint to create a new Razorpay order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body; // amount should be in paise (e.g., 1000 = ₹10)
  const options = {
    amount: amount,
    currency: "INR",
    receipt: "receipt_order_" + Date.now()
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating order.');
  }
});

// Webhook endpoint to handle payment confirmation (update transactions)
// NOTE: In a production app, verify the webhook signature from Razorpay.
router.post('/payment-callback', async (req, res) => {
  const { razorpay_order_id, amount, userId } = req.body; // Ensure you map the order to a user securely
  try {
    const transaction = new Transaction({
      user: userId,
      amount: amount,
      razorpayOrderId: razorpay_order_id
    });
    await transaction.save();
    res.status(200).json({ message: 'Payment recorded.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing payment callback.');
  }
});

module.exports = router;
