var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Worker = new Schema({
  email: String,
  password: String,
  chucvu: String,
  name: String,
  phone: String,
  diachi: String,
  ngaysinh: String,
  gioitinh: String,
  kichhoat: String,
});
module.exports = mongoose.model('Worker', Worker);