// models/Transaction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Transaction = sequelize.define('Transaction', {
  amount: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  razorpayOrderId: { 
    type: DataTypes.STRING 
  }
}, {
  tableName: 'transactions',
  timestamps: true  // Sequelize automatically adds createdAt and updatedAt
});

// Set up the association between transactions and users
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });

module.exports = Transaction;
