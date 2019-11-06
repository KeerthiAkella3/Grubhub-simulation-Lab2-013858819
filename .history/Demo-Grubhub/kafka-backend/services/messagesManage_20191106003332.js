const express = require('express');
const mountRoutes = require('.');
const sha1 = require('sha1');


var crypt = require('./bcrypt.js');
var Orders = require('../models/messagesSchema');


var app = express();
app.set('view engine', 'ejs');

router = express.Router();
var exports = module.exports;

exports.orderService = function orderService(msg, callback) {
  console.log("e path:", msg.path);
  switch (msg.path) {
    case "sendMessage":
      sendMessage(msg, callback);
      break;
    case "getMessages":
      getMessages(msg, callback);
      break;
  }
};

function sendMessage(msg, callback) {
  console.log("In add place order service. Msg: ", msg);
  let fromId = msg.fromId;
  let toId = msg.toId;
  Messages.create({
    restaurantId: msg.orderData.restaurantId,
    restaurantEmail: msg.orderData.restaurantEmail,
    restaurantName: msg.orderData.restaurantName,
    restaurantAddress: msg.orderData.restaurantAddress,
    buyerEmailId: msg.orderData.buyerEmailId,
    buyerId: msg.orderData.buyerId,
    buyerName: msg.orderData.buyerName,
    buyerAddress: msg.orderData.buyerAddress,
    restaurantOrderStatus: msg.orderData.restaurantOrderStatus,
    buyerOrderStatus: msg.orderData.buyerOrderStatus,
    items: msg.orderData.cartItems,
    totalPrice: msg.orderData.totalPrice,
  }, function (err, result) {
    if (err) {
      console.log("Failed to place an order in MongoDB.");
      callback(err, "Database error!");
    } else {
      console.log("Placed an order successfully in MongoDB. Id: " + result._id);
      callback(null, {
        status: 200,
        orderId: result._id,
      })
    }
  });
}

function getMessages(msg, callback) {
  console.log("Getting buyer order details");
  let fromId = msg.fromId;
  Messages.find({
    "fromId": fromId,
  }, function (err, result) {
    if (result && !err) {
      console.log("Received messages from " + fromId);
      let index = 0;
      let responseMessages = [];
      for (index = 0; index < result.length; index++) {
          let aConversation = result[index];
          if (aConversation.toId === msg.toId) {
              responseMessages.push(aConversation.messages)
          }
      }
      callback(null, {
        status: 200,
        conversation: responseMessages,
      })
    } else {
      console.log('Failed to retrieve conversation between ' + fromId + ' and' + toId);
      callback(err, "Database error");
    }
  })
}

//module.exports = orderService;