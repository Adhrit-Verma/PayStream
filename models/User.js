// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  upiId:    { type: String },
  bankAccount: {
    accountNumber: { type: String },
    ifsc:          { type: String }
  },
  alertSettings: {
    sound:    { type: String, default: 'default' },
    duration: { type: Number, default: 5 } // seconds
  }
});

module.exports = mongoose.model('User', UserSchema);
