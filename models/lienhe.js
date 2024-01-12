var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Lienhe = new Schema({
  name: String,
  email: String,
  danhgia:String,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Lienhe', Lienhe);