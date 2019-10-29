var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
UserSchema = new Schema({
  buyerName: {
    type: String,
    default: ''
  },
  restaurantName: {
    type: String,
    default: ''
  },
  buyerEmail: {
    type: String,
    default: ''
  },
  retaurantEmail: {
    type: String,
    default: ''
  },
  buyerPassword: {
    type: String,
    default: ''
  },
  ownerPassword: {
    type: String,
    default: ''
  },
  restaurantImg: {
    type: String,
    default: ''
  },
  buyerImg: {
    type: String,
    default: ''
  },
  buyerPhoneNumber: {
    type: Number,
    default: ''
  },
  restaurantPhoneNumber: {
    type: Number,
    default: ''
  },
  buyerAddress: {
    type: String,
    default: ''
  },
  restaurantAddress: {
    type: String,
    default: ''
  },
});
    
module.exports = mongoose.model('Users', UserSchema);