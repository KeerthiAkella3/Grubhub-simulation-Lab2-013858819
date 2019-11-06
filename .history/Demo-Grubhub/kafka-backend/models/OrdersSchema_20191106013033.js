var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

    restaurantName: {
        type: String,
        default: ''
    },

    restaurantAddress: {
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

    buyerName: {
        type: String,
        default: ''
    },

    buyerAddress: {
        type: String,
        default: ''
    },

    // items: [{
    //     "itemName": "pizza",
    //     "itemQuantity": 3,
    //     "itemTotalPrice": 39.99,
    //     "itemId" : <uniqueIdOfItemInMenu>,
    // },
    // {
    //     "itemName": "Chicken Burger",
    //     "itemQuantity": 4,
    //     "itemTotalPrice": 44.44,
    //     "itemId" : <uniqueIdOfItemInMenu>,
    // }
    // ]
    items: [],

    restaurantOrderStatus: {
        type: String,
        default: 'New'
    },

    buyerOrderStatus: {
        type: String,
        default: ''
    },

    totalPrice: {
        type: Number,
        default: 0.0,
    },

    messagesToOwner: [],
    messagesToBuyer: [],
});

module.exports = mongoose.model('Orders', OrdersSchema);