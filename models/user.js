var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = new Schema({
  email: String,
  password: String,
  name: String,
  phone: String,
  diachi: String,
  ngaysinh: String,
  gioitinh: String,

});
module.exports = mongoose.model('User', User);