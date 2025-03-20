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

// Create a new Razorpay order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body; // amount in paise (e.g., 1000 = ₹10)
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

// Payment callback endpoint to record transactions
router.post('/payment-callback', async (req, res) => {
  const { razorpay_order_id, amount, userId } = req.body;
  try {
    await Transaction.create({
      userId: userId,
      amount: amount,
      razorpayOrderId: razorpay_order_id
    });
    res.status(200).json({ message: 'Payment recorded.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing payment callback.');
  }
});

module.exports = router;
