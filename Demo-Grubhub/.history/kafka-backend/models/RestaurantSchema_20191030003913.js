var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
RestaurantSchema = new Schema({
  
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
  restaurantPassword: {
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
    type: String,
    default: ''
  },
  restaurantPhoneNumber: {
    type: String,
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
  cuisine: {
    type: String,
    default: ''
  },
});
    
module.exports = mongoose.model('restaurantMenu', RestaurantSchema);