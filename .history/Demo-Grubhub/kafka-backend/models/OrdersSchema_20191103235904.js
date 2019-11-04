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
  
  buyerEmailId: {
    type: String,
    default: ''
  },
  
  buyerId: {
    type: String,
    default: ''
  },
 
  buyerAddress: {
    type: String,
    default: ''
  },
  
  cartItems: [],

  buyerName: {
    type: String,
    default: ''
  },
});
    
module.exports = mongoose.model('Orders', OrdersSchema);