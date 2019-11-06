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
    case "getRestaurantOrders":
      getRestaurantOrders(msg, callback);
      break;
    case "deleteRestaurantOrders":
      deleteRestaurantOrders(msg, callback);
      break;
    case "updateRestaurantOrder":
      updateRestaurantOrder(msg, callback);
      break;
  }
};

function sendMessage(msg, callback) {
  console.log("In add place order service. Msg: ", msg);
  Orders.create({
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
  let buyerEmailId = msg.buyerEmailId;
  Orders.find({
    "buyerEmailId": buyerEmailId,
  }, function (err, allOrderData) {
    if (allOrderData && !err) {
      console.log("Received information from mongodb on buyer order details");
      callback(null, {
        status: 200,
        allOrderData: allOrderData,
      })
    } else {
      console.log("Failed to retrieve buyer information from mongodb");
      callback(err, "Database error");
    }
  })
}

function getRestaurantOrders(msg, callback) {
  console.log("Getting restaurant order details");
  console.log(msg);
  let restaurantId = msg.restaurantId;
  let restaurantOrderStatus = msg.restaurantOrderStatus;
  Orders.find({
    "restaurantId": restaurantId,
  }, function (err, allOrders) {
    let orderData = [];
    let index = 0;
    for (index = 0; index < allOrders.length; index++) {
      if (allOrders[index].restaurantOrderStatus === restaurantOrderStatus) {
        orderData.push(allOrders[index]);
      }
    }
    if (orderData && !err) {
      console.log("Received information from mongodb on buyer order details");
      callback(null, {
        status: 200,
        allOrderData: orderData,
      })
    } else {
      console.log("Failed to retrieve buyer information from mongodb");
      callback(err, "Database error");
    }
  })
}

function deleteRestaurantOrders(msg, callback) {
  let updateData = {};
  updateData = {
      "restaurantOrderStatus" : "Canceled",
      "buyerOrderStatus": "Rejected",
  }
  Orders.updateOne({
    "_id": msg.uniqueOrderId},
    updateData,
    function(err, result) {
    console.log('kafka result on update order');
    console.log(result);
    if (!err) {
      callback(null, {
        status: 200,
        success: true,
      })
    } else {
      callback(err, {
        status: 500,
        success: false,
      })
    } 
  })
  // Orders.deleteOne({
  //   "_id": msg.uniqueOrderId,
  // }, function (err, result) {
  //   console.log('kafka result on delete');
  //   console.log(result);
  //   if (!err) {
  //     callback(null, {
  //       status: 200,
  //       success: true,
  //     })
  //   } else {
  //     callback(err, {
  //       status: 500,
  //       success: false,
  //     })
  //   }
  // })
}

function updateRestaurantOrder(msg, callback) {
  let updateData = {};
  if (msg.newStatus === "Delivered") {
    updateData = {
      "restaurantOrderStatus" : msg.newStatus,
      "buyerOrderStatus": "Past",
    }
  } else {
    updateData = {
      "restaurantOrderStatus" : msg.newStatus,
    }
  }
  Orders.updateOne({
    "_id": msg.uniqueOrderId},
    updateData,
    function(err, result) {
    console.log('kafka result on update order');
    console.log(result);
    if (!err) {
      callback(null, {
        status: 200,
        success: true,
      })
    } else {
      callback(err, {
        status: 500,
        success: false,
      })
    } 
  })
}

//module.exports = orderService;