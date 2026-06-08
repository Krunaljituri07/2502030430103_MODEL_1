const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  brand: String,
  model: String,
  type: { type: String, enum: ['buy', 'rent', 'finance', 'lease'], required: true },
  amount: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  orderType: { type: String, enum: ['buy', 'rent', 'finance', 'lease', 'mixed'], default: 'buy' },
  paymentMethod: { type: String, default: 'card' },
  status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
