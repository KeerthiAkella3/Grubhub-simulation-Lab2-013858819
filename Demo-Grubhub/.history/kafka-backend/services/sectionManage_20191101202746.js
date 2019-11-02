const express = require('express');
const mountRoutes = require('.');
const sha1 = require('sha1');


var crypt = require('./bcrypt.js');
var Restaurant = require('../models/RestaurantSchema');


var app = express();
app.set('view engine', 'ejs');

router = express.Router();
var exports = module.exports;

exports.restaurantService = function restaurantService(msg, callback) {
    console.log("e path:", msg.path);
    switch (msg.path) {
        case "addSection":
            addSection(msg, callback);
            break;
        case "getSection":
            getSection(msg, callback);
            break;
        case "deleteSection":
            deleteSection(msg, callback)
            break
        case "getMenu"://this one
            getMenu(msg, callback);
            break;
        case "getMenuItem":
            getMenuItem(msg, callback);
            break;
        case "getAllItemMatch"://this one
            getAllItemMatch(msg, callback);
            break;
        case "addMenuItem":
            addMenuItem(msg,callback)
            break;
        case "deleteMenuItem":
            deleteMenuItem(msg,callback)
            break
    }
};


function addSection(msg, callback) {
  console.log("In add Section service. Msg: ", msg);
  
  Restaurant.findOne({_id: msg.restaurantId}, function(err,restaurant){
    if(restaurant){
      var section = {
        "sectionName":msg.sectionName,
        "items":{}
      }
      restaurant.sections.push(section)
      restaurant.save()
      if (err) {
        console.log("unable to insert section into database", err);
        callback(err, "Database Error");
      } else {
        console.log("section added Successful");
        callback(null, { status: 200, section });
      }
    }
    else{
      console.log(err);
      console.log("section not added")
    }
  })  
}

function getMenu(msg, callback){
  console.log("In getSection service. Msg: ", msg)
  Restaurant.findOne({_id: msg.restaurantId}, function(err,restaurant){
    if(restaurant){
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
    else{
      console.log(err);
      console.log("section not displayed")
    }
  })
}

function deleteSection(msg, callback) {
  console.log("In delete section service. Msg: ", msg);
  var sectionName = msg.sectionName
  //Users.findOneAndUpdate({ _id: msg.body.studentID }, { $pull: { 'courses': { course_id: parseInt(msg.body.courseID) } } }, function (err, result) {

  Restaurant.findOneAndUpdate({_id: msg.restaurantId},
    { $pull:{'sections':{sectionName:sectionName}
  }
  })
  
}

function addMenuItem(msg, callback) {
  console.log("In add menu Item service. Msg: ", msg);
  var sectionName = msg.sectionName
  Restaurant.findOne({_id: msg.restaurantId}, function(err,restaurant){
    if(restaurant){
      var item = {
        "itemName":msg.itemData.itemName,
        "itemDescription":msg.itemData.itemDesc,
        "itemImg":msg.itemData.itemImage,
        "itemPrice":msg.itemData.itemPrice
      }

      restaurant.sections.forEach(function(section){
        console.log("before adding in section");
        console.log(section);
        console.log(section["items"])
        section['items'] = [];
        restaurant.save()

        if(section["sectionName"] == sectionName){
            section["items"].push({"itemName":msg.itemData.itemName,
            "itemDescription":msg.itemData.itemDesc,
            "itemImg":msg.itemData.itemImage,
            "itemPrice":msg.itemData.itemPrice});
            restaurant.save()
            console.log(section["items"]);
        }
    });
    console.log(restaurant);
    restaurant.markModified("sections");
    restaurant.save(function(err){
        if(!err){
            callback(null, { status: 200, message:"item is added successfully!!" });
        } else{
            callback(null, { status: 200, message:"item not added!!" });
        }
    });
} 
else{
  console.log(err);
  console.log("item not added db err")
}
})
}

function deleteMenuItem(msg, callback) {
  console.log("In delete menu Item section service. Msg: ", msg);
  var sectionName = msg.body.sectionName
  var itemName = msg.body.item.itemName
  Restaurant.updateOne({_id: msg.restaurantId},{"sectionName":sectionName},{$pull:{items:{"itemName":itemName}
  }
  })
  if(!err){
    callback(null, { status: 200, message:"item is deleted successfully!!" });
} else{
    callback(null, { status: 200, message:"item not deleted!!" });
}
}

function getMenuItem(msg, callback){
  console.log("In get menu item service. Msg: ", msg)
  Restaurant.findOne({_id: msg.restaurantId},{"sectionName":msg.body.sectionName},{"itemName": msg.body.itemName}, function(err,restaurant){
    if(restaurant){
      if (err) {
        console.log("unable to retrive section from database", err);
        callback(err, "Database Error");
      } else {
        console.log("section added Successful");
        callback(null, { status: 200, lists: sectionList });
      }
    }
    else{
      console.log(err);
      console.log("item not displayed")
    }
  })
}


//module.exports = restaurantService;