var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
OrdersSchema = new Schema({

    from: {
        type: String,
        default: ''
    },

    to: {
        type: String,
        default: ''
    },

    messages: []

});

module.exports = mongoose.model('Orders', OrdersSchema);