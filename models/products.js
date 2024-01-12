var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Products = new Schema({
    name: String,
    anh: String,
    gia: Number,
    danhMuc: String,
    moTa: String,

});
module.exports = mongoose.model('Products', Products);