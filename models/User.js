const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  tuid: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  studentIdImage: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
