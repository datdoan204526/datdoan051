var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Admin = new Schema({
  email: String,
  password: String,
});
module.exports = mongoose.model('Admin', Admin);