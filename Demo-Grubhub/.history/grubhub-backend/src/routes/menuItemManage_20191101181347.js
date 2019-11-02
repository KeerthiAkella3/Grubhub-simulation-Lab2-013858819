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
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
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
          console.log("Got this from DB");
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

          resItem = {
            itemId: restaurantIdINT,
            itemName: anItem.itemName,
            itemDesc: anItem.itemDescription,
            itemPrice: anItem.itemPrice,
            itemSection: result.SectionName,
            itemCuisine: anItem.menuItemCuisine,
            itemImage: base64Image,
          }
          menuList.push(resItem);
        }

      }
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
router.get('/menuItem', requireAuth, function (req, res) {
  let response = [];
  console.log("In /menuItem backend")
  const getAllItemMatches = async () => {
    kafka.make_request('restaurantMenu', { "path": "getAllItemMatch", "restaurantId": restaurantId, "body": req.body }, function (err, result) {
      console.log("result from getAllItemMatch in menu item manage")
      console.log(result)
      let getAllItemMatchesResult = result
      if (getAllItemMatchesResult) {
        for (index = 0; index < getAllItemMatchesResult.length; index++) {
          let anItem = getAllItemMatchesResult[index];
          if (anItem.menuItemName === req.query.menuItemName) {
            resItem = {
              itemName: anItem.itemName,
              itemDesc: anItem.itemDescription,
              itemPrice: anItem.itemPrice,
              itemSection: anItem.sectionName,
              itemCuisine: Cuisine,
            }

            //let restaurantId = anItem.restaurantId;

            let restaurantDetails = ""//await LoginSignUpDBObj.getRestaurantDetails("restaurantTable", restaurantId);
            if (restaurantDetails.length > 0) {
              console.log(restaurantDetails[0]);
              resItem = {
                ...resItem,
                restaurantId: anItem.restaurantId,
                restaurantName: restaurantDetails[0].restaurantName,
                restaurantCuisine: restaurantDetails[0].restaurantCuisine,
              }
            } else {
              console.log("Query Result from query to restaurantTabel returned empty");
            }
            response.push(resItem);
          }
        }

        res.status(200).json({
          responseMessage: 'Found one or more items that matched',
          matchedItems: response
        })
      } else {
        res.status(500).json({
          responseMessage: 'Error while retreiving order details!',
          matchedItems: undefined
        });
      }
    })
  }


  try {
    getAllItemMatches();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Failed to place Order!' });
  }
})


/*
  * Call this end-point when restaurant needs to delete a section.
*/
router.post('/restaurantMenu', requireAuth, function (req, res) {
  //
  console.log("in restaurantMenu");
  console.log("result")
  console.log(res)
  console.log(req.body);
  var menuItemAddData = {
    menuItemName: req.body.menuItemName,
    menuItemDesc: req.body.menuItemDesc,
    menuItemImage: req.body.menuItemImage,
    menuItemPrice: req.body.menuItemPrice,
    menuItemSection: req.body.menuItemSection,
    restaurantId: req.body.restaurantId,
  }

  var addMenuItemQuery = [];
  
    kafka.make_request('restaurantMenu', { "path": "addMenuItem", "restaurantId": restaurantId, "body": req.body , "itemData":menuItemAddData}, function (err, result) {
      addMenuItemQuery = result
      console.log(addMenuItemQuery);
      if (addMenuItemQuery && addMenuItemQuery.affectedRows == 0) {
        res.status(500).json({
          responseMessage: 'Failed to add Item to Menu!'
        });
      } else {
        res.status(200).json({
          responseMessage: "Successfully Added Menu Item!",
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
  
    kafka.make_request('restaurantMenu', { "path": "addSection", "restaurantId": restaurantId,"sectionName":sectionName, "body": req.body }, function (err, result) {
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

module.exports = router;