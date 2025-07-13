const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: String,
  restaurant: String,
  orderDetails: String,
  deliveryLocation: String,
  deliveryTime: String,
  reward: String,
  status: { type: String, default: 'open' },
  deliveryPersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveryPersonName: String
}, { timestamps: true });


module.exports = mongoose.model('Order', orderSchema);
