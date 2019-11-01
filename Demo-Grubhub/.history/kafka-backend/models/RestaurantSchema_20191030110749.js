var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
RestaurantSchema = new Schema({
  
  
  restaurantName: {
    type: String,
    default: ''
  },
  
});
    
module.exports = mongoose.model('restaurantMenu', RestaurantSchema);