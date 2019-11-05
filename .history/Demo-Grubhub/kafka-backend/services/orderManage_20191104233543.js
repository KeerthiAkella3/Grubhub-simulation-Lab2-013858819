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
  }
};

function placeOrder(msg, callback) {
  console.log("In add place order service. Msg: ", msg);
  let orderId = undefined;
  let writeResult = Orders.create({
    restaurantId : msg.orderData.restaurantId,
    restaurantEmail : msg.orderData.restaurantEmailId,
    buyerEmailId : msg.orderData.buyerEmailId,
    buyerId : msg.orderData.buyerId,
    buyerName : msg.orderData.buyerName,
    buyerAddress : msg.orderData.buyerAddress,
    restaurantOrderStatus : msg.orderData.restaurantOrderStatus,
    buyerOrderStatus : msg.orderData.buyerOrderStatus,
    items : msg.orderData.cartItems,
  }, function(err, result) {
    if (err) {
      console.log("Failed to place an order in MongoDB.");
      callback(err, "Database error!");
    } else {
      console.log("Placed an order successfully in MongoDB. Id: " + orderId);
      callback(null, {
        status: 200, 
        orderId: result._id,
      })
    }
  });
}

function getMenu(msg, callback) {
  console.log("In getSection service. Msg: ", msg)
  Restaurant.findOne({ _id: msg.restaurantId }, function (err, restaurant) {
    if (restaurant) {
      let sectionList = restaurant.sections
      console.log(sectionList)
      if (err) {
        console.log("unable to retrive section from database", err);
        callback(err, "Database Error");
      } else {
        console.log("section retrived");
        callback(null, { status: 200, lists: sectionList, cuisine: restaurant.cuisine });
      }
    }
    else {
      console.log(err);
      console.log("section not displayed")
    }
  })
}

function deleteSection(msg, callback) {
  console.log("In delete section service. Msg: ", msg);
  var sectionName = msg.sectionName

  Restaurant.updateOne({ _id: msg.restaurantId },
    {
      $pull: {
        'sections': { sectionName: msg.sectionName }
      }
    }, function (err, result) {
      if (err) {
        console.log("unable to update database", err);
        callback(err, "Database Error");
      } else {
        console.log("Deletion Successful");
      }
    })
}
function addMenuItem(msg, callback) {
  console.log("In add menu Item service. Msg: ", msg);
  var sectionName = msg.sectionName
  Restaurant.findOne({ _id: msg.restaurantId }, function (err, restaurant) {
    console.log("okayyyyy")
    if (restaurant) {
      var item = {
        "itemName": msg.itemData.itemName,
        "itemDescription": msg.itemData.itemDesc,
        "itemImg": msg.itemData.itemImage,
        "itemPrice": msg.itemData.itemPrice
      }

      restaurant.sections.forEach(function (section) {
        console.log("whyyyyyy")
        console.log("before adding in section");
        console.log(section);
        console.log(section["items"])
        section["items"] = [];
        if (section["sectionName"] == sectionName) {
          console.log("sectionName equal")
          section["items"].push({
            "itemName": msg.itemData.itemName,
            "itemDescription": msg.itemData.itemDesc,
            "itemImg": msg.itemData.itemImage,
            "itemPrice": msg.itemData.itemPrice
          });
          
          console.log(section["items"]);
        }
      });
      console.log(restaurant);
      restaurant.markModified("sections");
      restaurant.save(function (err) {
        if (!err) {
          callback(null, { status: 200, message: "item is added successfully!!" });
        } else {
          callback(null, { status: 200, message: "item not added!!" });
        }
      });
    }
    else {
      console.log(err);
      console.log("item not added db err")
    }
  })
}

function deleteMenuItem(msg, callback) {
  console.log("In delete menu Item section service. Msg: ", msg);
  var sectionName = msg.sectionName
  var itemName = msg.itemData.itemName
  Restaurant.updateOne({ _id: msg.restaurantId }, { "sectionName": sectionName }, {
    $pull: {
      items: { "itemName": itemName }
    }, function(err, result) {
      if (err) {
        console.log("unable to update database", err);
        callback(err, "Database Error");
      } else {
        console.log("Deletion Successful");
      }
    }

  })
}

function getMenuItem(msg, callback) {
  console.log("In get menu item service. Msg: ", msg)
  Restaurant.findOne({ _id: msg.restaurantId }, { "sectionName": msg.body.sectionName }, { "itemName": msg.body.itemName }, function (err, restaurant) {
    if (restaurant) {
      if (err) {
        console.log("unable to retrive section from database", err);
        callback(err, "Database Error");
      } else {
        console.log("section added Successful");
        callback(null, { status: 200, lists: sectionList });
      }
    }
    else {
      console.log(err);
      console.log("item not displayed")
    }
  })
}

function getAllItemMatch(msg, callback) {
  console.log("in get all item match ");
  allMatchedRestaurants = [];
  Restaurant.find({}, function (err, allDocuments) {
    if (err) {
      console.log('could not find matching items from database', err);
      callback(err, "Database error");
    } else {
      console.log('found a matching item');
      callback(null, {status: 200, allRestaurants: allDocuments})
    }
  });
}
//module.exports = orderService;