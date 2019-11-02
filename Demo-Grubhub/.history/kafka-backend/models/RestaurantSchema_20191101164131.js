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
    sectionName:{
      type: String,
     default:''
    },
    items:{
      itemName:{
        type: String,
        default:''
      },
      itemDescription:{
        type: String,
        default:''
      },
      itemPrice:{
        type: String,
        default:''
      },
      itemImg:{
        type: String,
        default:''
      }
    }
    
  }
  
});
    
module.exports = mongoose.model('Restaurant', RestaurantSchema);