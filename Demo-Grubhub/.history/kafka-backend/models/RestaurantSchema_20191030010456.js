var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
RestaurantSchema = new Schema({
  
  
  restaurantName: {
    type: String,
    default: ''
  },
  itemName:{
      type: String,
      default:''
  },

  itemDesc: {
      type: String,
      default:''
  },
  itemPrice:{
      type: String,
      default:''
  },
  itemSection:{
      type: String,
      default:''
  },
  itemCuisine:{
    type: String,
    default:''
  },
  itemImg: {
    type: String,
    default: ''
  }
});
    
module.exports = mongoose.model('restaurantMenu', RestaurantSchema);