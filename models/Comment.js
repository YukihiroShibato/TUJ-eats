const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  text: String
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
