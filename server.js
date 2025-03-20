// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

// Import the database connection (PostgreSQL via Sequelize)
const sequelize = require('./config/db');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: false, // For production, adjust as needed
    // For production, consider using a session store like connect-pg-simple or connect-redis.
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routes
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/account', require('./routes/account'));
app.use('/razorpay', require('./routes/razorpay'));

// Basic landing page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sync database models and then start the server
const PORT = process.env.PORT || 3000;
sequelize.sync()  // You can use { force: true } here during development to reset tables
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database sync error:', err));
