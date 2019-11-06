const express = require('express');
const mountRoutes = require('.');
const sha1 = require('sha1');


var crypt = require('./bcrypt.js');
var Orders = require('../models/OrdersSchema');


var app = express();
app.set('view engine', 'ejs');

router = express.Router();
var exports = module.exports;

exports.orderService = function orderService(msg, callback) {
  console.log("e path:", msg.path);
  switch (msg.path) {
    case "placeOrder":
      placeOrder(msg, callback);
      break;
    case "getBuyerOrder":
      getBuyerOrder(msg, callback);
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
    case "sendMessageToBuyer":
      sendMessagesToBuyer(msg, callback);
      break;
    case "sendMessageToOwner":
      sendMessagesToOwner(msg, callback);
      break;
    case "getMessages":
      getMessages(msg, callback);
      break;
  }
};

function placeOrder(msg, callback) {
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

function getBuyerOrder(msg, callback) {
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
    "restaurantOrderStatus": "Canceled",
    "buyerOrderStatus": "Rejected",
  }
  Orders.updateOne({
    "_id": msg.uniqueOrderId
  },
    updateData,
    function (err, result) {
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
      "restaurantOrderStatus": msg.newStatus,
      "buyerOrderStatus": "Past",
    }
  } else {
    updateData = {
      "restaurantOrderStatus": msg.newStatus,
    }
  }
  Orders.updateOne({
    "_id": msg.uniqueOrderId
  },
    updateData,
    function (err, result) {
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

function sendMessagesToBuyer(msg, callback) {
  console.log("In add place order service. Msg: ", msg);
  let messages = [];
  let uniqueOrderId = msg.uniqueOrderId;
  Orders.findOne({ "_id": msg.uniqueOrderId }, function (err, result) {
    if (err) {
      callback(err, {
        status: 500,
        success: false,
      })
    } else {
      console.log("Found messages for orderid:" + uniqueOrderId);
      messages = result.messagesToBuyer;
      messages.push(msg.message);
    }
    Orders.updateOne({"_id": uniqueOrderId}, { $set : {"messagesToBuyer": messages}}, function (err, result) {
      if (err) {
        console.log("Failed to place an order in MongoDB.");
        callback(err, {
          success: false,
          status: 500,
        });
      } else {
        console.log("Placed an order successfully in MongoDB. Id: " + result._id);
        callback(null, {
          status: 200,
          success: true,
        })
      }
    })
  });
  
}


function sendMessagesToOwner(msg, callback) {
  console.log("In add place order service. Msg: ", msg);
  let messages = [];
  Orders.findOne({ '_id': msg.uniqueOrderId }, function (err, result) {
    if (err) {
      isCreate = true;
    } else {
      console.log("Found messages for orderId" + msg.uniqueOrderId);
      messages = result.messagesToOwner;
      console.log(messages);
    }
    messages.push(msg.message);
    console.log('after pushing');
    console.log(messages);
  });
  Orders.updateOne({"_id": msg.uniqueOrderId}, { $set : {"messagesToOwner": messages}}, function (err, result) {
    if (err) {
      console.log("Failed to place an order in MongoDB.");
      callback(err, {
        success: false,
        status: 500,
      });
    } else {
      console.log("saved message to owner successfully in MongoDB. Id");
      callback(null, {
        status: 200,
        success: true,
      })
    }
  })

}

function getMessages(msg, callback) {
  console.log("Getting buyer order details");
  let uniqueOrderId = msg.uniqueOrderId;
  Orders.findOne({
    "_id": uniqueOrderId,
  }, function (err, result) {
    if (result && !err) {
      console.log("Received messages for order id: " + uniqueOrderId);
      console.log(result);
      let responseMessagesToBuyer = result.messagesToBuyer;
      let responseMessagesToOwner = result.messagesToOwner;
      callback(null, {
        status: 200,
        messagesToBuyer: responseMessagesToBuyer,
        messagesToOwner: responseMessagesToOwner,
      })  
    } else {
      console.log('Failed to retrieve conversation for order id: ' + uniqueOrderId);
      callback(err, "Database error");
    }
  })
}

//module.exports = orderService;