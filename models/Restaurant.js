const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branch: { type: String, required: true },
  category: { type: String, required: true },
  photoFilename: String
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
