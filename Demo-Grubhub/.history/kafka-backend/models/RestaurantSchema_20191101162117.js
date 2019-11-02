var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
RestaurantSchema = new Schema({
  
  restaurantName: {
    type: String,
    default: ''
  },
  
  retaurantEmail: {
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
 
  restaurantPhoneNumber: {
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
  
  sections:{
    

  }
  
});
    
module.exports = mongoose.model('Restaurant', RestaurantSchema);