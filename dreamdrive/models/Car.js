const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  category: { type: String, default: 'sports' },
  price: { type: Number, required: true },
  rentalPrice: { type: Number, required: true },
  image: String,
  color: String,
  year: Number,
  acceleration: String,
  maxSpeed: String,
  power: String,
  fuel: String,
  seats: Number,
  rating: Number,
  reviews: Number,
  featured: Boolean,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Car', carSchema);
