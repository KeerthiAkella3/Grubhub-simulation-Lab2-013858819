var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// restaurantEmailId: this.state.restaurantEmailId,
// restaurantId: this.state.restaurantId,
// buyerEmailId: this.state.buyerEmailId,
// buyerAddress: this.state.buyerAddress,
// cartItems: this.state.cartItems,
// buyerName: this.state.buyerName,

//schema
OrdersSchema = new Schema({
  
  restaurantId: {
    type: String,
    default: ''
  },
  
  restaurantEmail: {
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
  
  sections:[]
  
});
    
module.exports = mongoose.model('Orders', OrdersSchema);