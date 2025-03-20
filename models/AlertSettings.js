// models/AlertSettings.js
const mongoose = require('mongoose');

const AlertSettingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customMessage: { type: String, default: 'Thank you for your support!' },
  overlayPosition: { type: String, default: 'top-right' }
});

module.exports = mongoose.model('AlertSettings', AlertSettingsSchema);
