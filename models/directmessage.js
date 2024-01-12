// directMessage.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const directMessageSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Thay 'User' bằng tên model của user trong ứng dụng của bạn
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'Admin', // Thay 'Admin' bằng tên model của admin trong ứng dụng của bạn
  },
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const DirectMessage = mongoose.model('DirectMessage', directMessageSchema);

module.exports = DirectMessage;
