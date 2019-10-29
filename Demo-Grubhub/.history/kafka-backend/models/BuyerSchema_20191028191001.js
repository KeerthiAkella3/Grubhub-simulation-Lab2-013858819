var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schemacl
console.log("in buyers")
BuyerSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  img: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: Number,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
});
    
module.exports = mongoose.model('Buyers', BuyerSchema); 