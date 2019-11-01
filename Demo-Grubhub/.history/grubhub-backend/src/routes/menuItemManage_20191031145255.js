const express = require('express');
const path = require('path');
var fs = require('fs');
const multer = require('multer');

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
  let restaurantIdINT = parseInt(req.query.restaurantId);
  console.log("in backend menu item manage /menu")
  //console.log(res)
  const getMenu = async () => {
    kafka.make_request('restaurantMenu', { "path": "menu", "restaurantId": restaurantIdINT, "body": req.body }, function (err, result) {
      console.log("result from /menu in menu item manage")
      console.log(result)
      let getSectionsResult = result;
      if (getSectionsResult !== undefined) {
        for (let index = 0; index < getSectionsResult.length; index++) {
          let anSectionItem = getSectionsResult[index];
          if (anSectionItem.restaurantId === restaurantIdINT) {
            console.log('found a match!');
            sectionsResult.push(anSectionItem.sectionName);
          }
        }
        console.log(getSectionsResult);
        console.log(sectionsResult);
      }
    })

    kafka.make_request('restaurantMenu', { "path": "getMenu", "restaurantId": restaurantIdINT, "body": req.body }, function (err, result) {
      console.log("result from get menu in menu item manage")
      console.log(result)
      let getMenuResult = result
      if (getMenuResult) {
        console.log(getMenuResult);
        for (index = 0; index < getMenuResult.length; index++) {
          let anItem = getMenuResult[index];
          if (anItem.restaurantId === restaurantIdINT) {

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
              itemId: anItem.menuItemId,
              itemName: anItem.menuItemName,
              itemDesc: anItem.menuItemDesc,
              itemPrice: anItem.menuItemPrice,
              itemSection: anItem.menuItemSection,
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

    kafka.make_request('restaurantMenu', { "path": "restaurantDetails", "restaurantId": restaurantId, "body": req.body }, function (err, result) {
      console.log("result from restaurantDetails in menu item manage")
      console.log(result)
      let getRestaurantDetails = result
      if (getRestaurantDetails !== undefined) {
        let detailsResult = getRestaurantDetails[0];
        if (detailsResult) {
          restaurantDetails = {
            restaurantId: req.query.restaurantId,
            restaurantName: detailsResult.restaurantName,
            restaurantEmailId: detailsResult.restaurantEmailId,
            restaurantCuisine: detailsResult.restaurantCuisine,
            restaurantPhone: detailsResult.restaurantPhone,
          }
        }
      }

      res.status(200).json({
        responseMessage: 'Found one or more items that matched',
        menu: menuList,
        sections: sectionsResult,
        restaurantDetails: restaurantDetails,
      })
    })

    try {
      getMenu();
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Failed to place Order!' });
    }
  }
})


/*
  * Call this endpoint from Buyer, when Buyer is placing an Order
  */
router.get('/menuItem', function (req, res) {
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
              itemName: anItem.menuItemName,
              itemDesc: anItem.menuItemDesc,
              itemPrice: anItem.menuItemPrice,
              itemSection: anItem.menuItemSection,
              itemCuisine: anItem.menuItemCuisine,
            }

            let restaurantId = anItem.restaurantId;
            let restaurantDetails = await LoginSignUpDBObj.getRestaurantDetails("restaurantTable", restaurantId);
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
router.post('/restaurantMenu', function (req, res) {
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
  const addMenuItem = async () => {
    kafka.make_request('restaurantMenu', { "path": "addMenuItem", "restaurantId": restaurantId, "body": req.body }, function (err, result) {
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
  }

  try {
    addMenuItem();
  }
  catch (err) {
    console.log(err);
    res.status(503).json({ responseMessage: 'Database not responding' });
  }
})

function base64_encode(file) {
  var bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString('base64');
}

/*
  * Call this endpoint from Restaurant Owner, when restaurant Owner is managing status of order
  * From new --> preparing --> ready --> delivered.
  */
router.delete('/restaurantMenu', function (req, res) {

  let menuItemId = req.query.menuItemId;
  const deleteMenuItem = async () => {
    kafka.make_request('restaurantMenu', { "path": "restaurantSection", "restaurantId": restaurantId, "body": req.body }, function (err, result) {
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
  }

  try {
    deleteMenuItem();
  }
  catch (err) {
    console.log(err);
    res.status(503).json({ responseMessage: 'Database not responding' });
  }
})

module.exports = router;