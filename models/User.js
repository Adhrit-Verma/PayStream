// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  upiId: { 
    type: DataTypes.STRING 
  },
  accountNumber: { 
    type: DataTypes.STRING 
  },
  ifsc: { 
    type: DataTypes.STRING 
  },
  alertSound: { 
    type: DataTypes.STRING, 
    defaultValue: 'default' 
  },
  alertDuration: { 
    type: DataTypes.INTEGER, 
    defaultValue: 5 
  }
}, {
  tableName: 'users'
});

module.exports = User;
