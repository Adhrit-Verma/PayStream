// models/AlertSettings.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const AlertSettings = sequelize.define('AlertSettings', {
  customMessage: {
    type: DataTypes.STRING,
    defaultValue: 'Thank you for your support!'
  },
  overlayPosition: {
    type: DataTypes.STRING,
    defaultValue: 'centre'
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
  tableName: 'alert_settings',
  timestamps: false // Disable timestamps if not needed
});

// Set up a one-to-one association with User
AlertSettings.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(AlertSettings, { foreignKey: 'userId', as: 'alertSettings' });

module.exports = AlertSettings;
