// Dùng để lưu trữ đơn hàng đã duyệt
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const OrderItem = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Products' },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number },
  });
const ApprovedOrder = new Schema({
    originalOrderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    items: [OrderItem], // Copy cấu trúc từ OrderItem của mô hình Order
    totalAmount: { type: String },
    orderPlacedAt: { type: Date },
    paymentMethod: { type: String },
    status: { type: String, default: 'Approved' }, // Thêm trường trạng thái đã duyệt
});

module.exports = mongoose.model('ApprovedOrder', ApprovedOrder);
