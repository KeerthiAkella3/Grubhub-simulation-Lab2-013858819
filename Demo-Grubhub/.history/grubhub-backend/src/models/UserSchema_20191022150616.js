var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
UserSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: ''
  },
  img: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: Number,
    default: ''
  }
});
    
module.exports = mongoose.model('Users', UserSchema);