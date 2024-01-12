
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItem = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Products' },
  quantity: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Cart = new Schema({
  user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  items: [CartItem]
});
Cart.methods.removeProduct = function(productId) {
  // Find the index of the item with the specified product ID
  const index = this.items.findIndex(item => item.product.equals(productId));

  // If the product is found, remove it from the items array
  if (index !== -1) {
    this.items.splice(index, 1);
  }

  // Update the updatedAt field
  this.updatedAt = Date.now();

  // Save the changes
  return this.save();
};
module.exports = mongoose.model('Cart', Cart);
