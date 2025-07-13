const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: String,
  text: String,
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
