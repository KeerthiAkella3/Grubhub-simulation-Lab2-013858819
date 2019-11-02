var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
UserSchema = new Schema({
  
  buyerName: {
    type: String,
    default: ''
  },

  buyerEmail: {
    type: String,
    default: ''
  },

  buyerPassword: {
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
  
  buyerAddress: {
    type: String,
    default: ''
  },
});
    
module.exports = mongoose.model('Users', UserSchema);