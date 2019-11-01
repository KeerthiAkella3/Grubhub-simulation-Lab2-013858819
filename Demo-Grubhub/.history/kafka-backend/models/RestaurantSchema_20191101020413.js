var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
RestaurantSchema = new Schema({
  
  
  restaurantName: {
    type: String,
    default: ''
  },
  section:{

  }
  
});
    
module.exports = mongoose.model('restaurantMenu', RestaurantSchema);