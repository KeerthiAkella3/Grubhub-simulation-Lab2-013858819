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
  let isCreate = false;
  let messages = [];
  Messages.findOne({fromId: fromId, toId: toId}, function (err, result) {
    if (err) {
        isCreate = true;
    } else {
        console.log("Found messages between " + fromId + " and " + toId);
        messages = result.messages;
    }
  });
  messages.push(msg.message);
  if (isCreate) {
    Messages.create({
        fromId: fromId,
        toId: toId,
        messages: messages,
    }, function (err, result) {
        if (err) {
            console.log("Failed to place an order in MongoDB.");
            callback(err, "Database error!");
          } else {
            console.log("Placed an order successfully in MongoDB. Id: " + result._id);
            callback(null, {
              status: 200,
              conversationId: result._id,
            })
          }
    })
  } else {
    Messages.updateOne({
        fromId: fromId,
        toId: toId,
        messages: messages,
    })
  }

}

function getMessages(msg, callback) {
  console.log("Getting buyer order details");
  let fromId = msg.fromId;
  let toId = msg.toId;
  Messages.find({
    "fromId": fromId,
  }, function (err, result) {
    if (result && !err) {
      console.log("Received messages from " + fromId);
      let index = 0;
      let responseMessages = [];
      for (index = 0; index < result.length; index++) {
          let aConversation = result[index];
          if (aConversation.toId === toId) {
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