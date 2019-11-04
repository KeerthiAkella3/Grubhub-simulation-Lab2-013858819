const express = require('express');
const path = require('path');
var fs = require('fs');
const multer = require('multer');

var passport = require('passport');
var requireAuth = passport.authenticate('jwt', { session: false });

var config = require('../../config/settings');
var kafka = require('../kafka/client');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/profilePictures');
  },
  filename: (req, file, callback) => {
    fileExtension = file.originalname.split('.')[1];
    console.log("fileExtension", fileExtension);
    callback(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + fileExtension);
  },
});

var upload = multer({ storage: storage });
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var app = express();
app.set('view engine', 'ejs');

router = express.Router();

router.get('/menu', function (req, res) {
  let menuList = [];
  let sectionsResult = [];
  let restaurantDetails = {};
  let restaurantIdINT = req.query.restaurantId;
  console.log("in backend menu item manage /menu")
  console.log(req.query)

  console.log("in get menu method")
  kafka.make_request('restaurantMenu', { "path": "getMenu", "restaurantId": restaurantIdINT }, function (err, result) {
    console.log("result from get menu in menu item manage")
    console.log(result)
    let getMenuResult = result.lists
    if (getMenuResult) {
      console.log(getMenuResult);
      for (index = 0; index < getMenuResult.length; index++) {
        let anItem = getMenuResult[index];
        if (anItem) {
          let imageFilepath = undefined;
          let base64Image = undefined;
          console.log("Got this from DB menu anItem");
          console.log(anItem);
          if (anItem.menuItemImage === null || anItem.menuItemImage === undefined || anItem.menuItemImage.length === 0) {
            // res.status(400).json({ responseMessage: 'Record not found' });
            console.log('No Image found for this item');
          } else if (typeof anItem.menuItemImage === "string") {
            console.log(anItem.menuItemImage);
            imageFilepath = path.join(__dirname, "../uploads/profilePictures", anItem.menuItemImage);
            console.log("file path.." + imageFilepath);
          } else {
            console.log('invalid image');
          }
          if (imageFilepath !== undefined) {
            try {
              base64Image = base64_encode(imageFilepath);
            } catch (err) {
              console.log("Unable to read image");
            }
          }
          console.log("anItem.items.length")
          console.log(anItem.items.length)
          for (var j = 0; j < anItem.items.length; j++) {
            resItem = {
              itemId: restaurantIdINT,
              itemName: anItem.items[j].itemName,
              itemDesc: anItem.items[j].itemDescription,
              itemPrice: anItem.items[j].itemPrice,
              itemSection: anItem.sectionName,
              itemImage: base64Image,
            }
            menuList.push(resItem);
          }


          sectionsResult.push(anItem.sectionName)
        }
        console.log("menu items in menu item manage")
        console.log(menuList)
      }
      res.status(200).json({
        responseMessage: 'Found one or more items that matched',
        menu: menuList,
        sections: sectionsResult,
        restaurantDetails: restaurantDetails,
      })
    } else {
      res.status(500).json({
        responseMessage: 'Error while retreiving order details!',
        menu: undefined
      });
    }
  })

})

/*
  * Call this endpoint from Buyer, when Buyer is placing an Order
  */
router.get('/menuItem', function (req, res) {
  let response = [];
  console.log("In /menuItem backend")
  kafka.make_request('restaurantMenu', { "path": "getAllItemMatch", "body": req.body }, function (err, result) {
    console.log("result from getAllItemMatch in menu item manage")
    console.log(result);
    var allRestaurantsInfo = result.allRestaurants;
    if (allRestaurantsInfo === undefined || allRestaurantsInfo.length === 0) {
      res.status(500).json({
        responseMessage: 'Could not find any restaurant entries in database!',
      });
    }
    var restaurantIndex = 0;
    for (restaurantIndex = 0; allRestaurantsInfo !== undefined && restaurantIndex < allRestaurantsInfo.length; restaurantIndex++) {
      var resItem = {};
      var sectionIndex = 0;
      var aRestaurant = allRestaurantsInfo[restaurantIndex];
      console.log(aRestaurant);
      var sectionList = aRestaurant.sections;
      for (sectionIndex = 0; sectionList !== undefined && sectionIndex < sectionList.length; sectionIndex++) {
        let section = sectionList[sectionIndex];
        console.log(section);
        let itemListIndex = 0;
        let itemList = section.items;
        console.log(itemList);
        for (itemListIndex = 0; itemList !== undefined && itemListIndex < itemList.length; itemListIndex++) {
          let anItem = itemList[itemListIndex];
          console.log('checking item: ');
          console.log(anItem);
          if (anItem.itemName === req.query.menuItemName) {
            console.log('matched item: ' + anItem.itemName);
            resItem = {
              itemName: anItem.itemName,
              itemDesc: anItem.itemDescription,
              itemPrice: anItem.itemPrice,
              itemCuisine: aRestaurant.cuisine,
            }
          }
        }
        if (JSON.stringify(resItem) !== "{}") {
          resItem = {
            ...resItem,
            itemSection: section.sectionName,
          }
        }
      }
      if (JSON.stringify(resItem) !== "{}") {
        resItem = {
          ...resItem,
          restaurantId: aRestaurant._id,
          restaurantName: aRestaurant.restaurantName,
          restaurantCuisine: aRestaurant.cuisine,
        }
      }
      console.log('Pushing to response')
      console.log(resItem);
      response.push(resItem);
      resItem = {};
    }
    res.status(200).json({
      responseMessage: 'Found one or more items that matched',
      matchedItems: response
    })
  });

})

/*
  * Call this end-point when restaurant needs to delete a section.
*/
router.post('/restaurantMenu', function (req, res) {
  //
  console.log("in restaurantMenu");
  console.log("result")
  console.log(res)
  console.log(req.body);

  var restaurantId = req.body.restaurantId
  console.log("restaurantId")
  console.log(restaurantId)
  var menuItemAddData = {
    itemName: req.body.menuItemName,
    itemDesc: req.body.menuItemDesc,
    itemImage: req.body.menuItemImage,
    itemPrice: req.body.menuItemPrice,
    itemSection: req.body.menuItemSection,
    restaurantId: req.body.restaurantId,
  }

  var addMenuItemQuery = [];

  kafka.make_request('restaurantMenu', { "path": "addMenuItem", "restaurantId": restaurantId, "sectionName": req.body.menuItemSection, "itemData": menuItemAddData }, function (err, result) {
    addMenuItemQuery = result
    console.log(addMenuItemQuery);
    if (addMenuItemQuery && addMenuItemQuery.affectedRows == 0) {
      res.status(500).json({
        responseMessage: 'Failed to add Item to Menu!'
      });
    } else {
      res.status(200).json({
        responseMessage: "Successfully Added Menu Item!",
        status: 200,
        menuItemUniqueId: addMenuItemQuery.insertId
      });
    }
  })

})

function base64_encode(file) {
  var bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString('base64');
}

/*
  * Call this endpoint from Restaurant Owner, when restaurant Owner is managing status of order
  * From new --> preparing --> ready --> delivered.
  */
router.delete('/restaurantMenu', requireAuth, function (req, res) {
  console.log("in /restaurantMenu delete")
  console.log("result")
  console.log(res)
  let menuItemName = req.query.menuItemName;

  kafka.make_request('restaurantMenu', { "path": "deleteMenuItem", "restaurantId": restaurantId, "body": req.query, "itemName": menuItemName }, function (err, result) {
    let deleteMenuItemQuery = result
    if (deleteMenuItemQuery && deleteMenuItemQuery.affectedRows != 1) {
      res.status(404).json({
        responseMessage: 'Menu Item Not Found!'
      });
    } else {
      res.status(200).json({
        responseMessage: "Menu Item successfully Deleted!"
      });
    }
  })

})

router.post('/restaurantSection', function (req, res) {
  console.log("In restaurant section")
  console.log("request")
  console.log(req.body)

  let restaurantId = req.body.restaurantId;
  let sectionName = req.body.sectionName;

  var addSectionQuery = [];

  kafka.make_request('restaurantMenu', { "path": "addSection", "restaurantId": restaurantId, "sectionName": sectionName, "body": req.body }, function (err, result) {
    addSectionQuery = result;
    console.log("result in restaurant section-backend ")
    console.log(result)
    if (addSectionQuery === undefined) {
      res.status(404).json({
        responseMessage: 'Order Not Found!'
      });
      console.log("order not found")
    } else {
      res.status(200).json({
        responseMessage: "Order successfully Deleted!",
        sectionId: addSectionQuery.insertId
      });
    }

  });
})

router.delete('/restaurantSection', function (req, res) {
  console.log("In restaurant section")
  console.log("request")
  console.log(req.query)

  let restaurantId = req.query.restaurantId;
  let sectionName = req.query.sectionName;

  var deleteSectionQuery = [];

  kafka.make_request('restaurantMenu', { "path": "deleteSection", "restaurantId": restaurantId, "sectionName": sectionName, "body": req.body }, function (err, result) {
    deleteSectionQuery = result;
    console.log("result in delete restaurant section-backend ")
    console.log(result)
    if (deleteSectionQuery === undefined) {
      res.status(404).json({
        responseMessage: 'Order Not Found!'
      });
      console.log("order not found")
    } else {
      res.status(200).json({
        responseMessage: "Order successfully Deleted!",
        sectionId: addSectionQuery.insertId
      });
    }

  });
})
module.exports = router;