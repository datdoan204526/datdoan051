const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItem = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Products' },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number },
});

const Order = new Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  items: [OrderItem],
  totalAmount: { type: String },
  orderPlacedAt: { type: Date },
  paymentMethod: { type: String },
});

module.exports = mongoose.model('Order', Order);
