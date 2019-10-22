const express = require('express');
const LoginSignUpDB = require('../../grubhub-backend/src/routes/LoginSignUpDB');
const LoginSignUpDBObj = new LoginSignUpDB();
var app = express();
app.set('view engine', 'ejs');
const router = express.Router();
var fs = require('fs');
const multer = require('multer');
const path = require('path');

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

router.post('/updateBuyerProfile', function (req, res) {
  console.log("Inside profile put request");
  console.log("Request Body in update buyer:");
  console.log(req.body);
  let buyerEmailId = req.body.buyerEmailId;
  let buyerId = req.body.buyerId
  console.log("email Id and tablename " + buyerEmailId + "  buyerTable")
  var queryResult = [];
  var inputData = {
    "buyerName": req.body.buyerName,
    "buyerEmailId": req.body.buyerEmailId,
    "buyerPhone": req.body.buyerPhone,
    "buyerAddress": req.body.buyerAddress,
    "buyerId": req.body.buyerId,
  }
  console.log("in input data update buyer " + inputData.buyerName);
  const getProfileData = async () => {
    queryResult = await LoginSignUpDBObj.updateBuyer("buyerTable", buyerId, inputData);
    if (queryResult) {
      console.log("Data updated!");
      res.status(200).json({
        responseMessage: 'Successfully updated profile of ' + inputData.buyerName,
        updateResult: queryResult
      });
    }
    else {
      res.status(400).json({ responseMessage: 'Record not found' });
    }
  }
  try {
    getProfileData();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});

router.post('/updateOwner', function (req, res) {
  console.log("Inside profile put request");
  console.log("Request Body in update Owner:");
  console.log(req.body);
  let emailId = req.body.emailId;
  let table = req.body.table;
  let restaurantId = req.body.restaurantId

  console.log("email Id and tablename " + req.body.emailId + "  " + req.body.table)

  var queryResult = [];
  var inputData = {
    "restaurantName": req.body.restaurantName,
    "restaurantEmailId": req.body.restaurantEmailId,
    "restaurantPhone": req.body.restaurantPhone,
    "restaurantAddress": req.body.restaurantAddress,
    "restaurantCuisine": req.body.restaurantCuisine,
    "restaurantId": req.body.restaurantId
  }

  console.log("in input data update buyer   " + inputData.restaurantName)
  const getProfileData = async () => {
    queryResult = await LoginSignUpDBObj.updateOwner(table, restaurantId, inputData);
    if (queryResult) {
      console.log("Data updated!");
      res.status(200).json(queryResult);
    }
    else {
      res.status(400).json({ responseMessage: 'Record not found' });
    }
  }
  try {
    getProfileData();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});

router.post('/img/upload', upload.single('selectedFile'), function (req, res) {
  console.log("Inside post profile img");
  console.log("Request body:");
  console.log(req.body);
  console.log("filename", req.file.filename);
  let filename = req.file.filename;
  var queryResult = [];
  let id = req.body.id;
  let table = req.body.table;
  const addProfilePic = async () => {
    if (table === "restaurantTable") {
      queryResult = await LoginSignUpDBObj.addRestaurantProfilePic(table, id, filename);
    } else if (table === "buyerTable") {
      queryResult = await LoginSignUpDBObj.addBuyerProfilePic(table, id, filename);
    } else {
      queryResult = await LoginSignUpDBObj.addMenuItemImage(table, id, filename);
    }
    if (queryResult) {
      console.log("pic added");
      res.status(200).json({ responseMessage: 'File successfully uploaded!' });
    }
    else {
      res.status(400).json({ responseMessage: 'Record not found' });
    }
  }
  try {
    addProfilePic();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});

router.get('/profile/img', function (req, res) {
  console.log("Inside profile get request");
  console.log("Request params:");
  console.log(req.query);
  let id = req.query.id;
  let table = req.query.table;
  let queryResult = [];
  let filename = '';
  let anMenuItemImage = '';
  const getProfilepic = async () => {
    if (table === "restaurantTable") {
      queryResult = await LoginSignUpDBObj.getRestaurantProfilepic(table, id);
    } else if (table === "buyerTable") {
      queryResult = await LoginSignUpDBObj.getBuyerProfilepic(table, id);
    } else {
      queryResult = await LoginSignUpDBObj.getMenuItemImage(table, id);
      if (queryResult !== undefined) {
          console.log(JSON.stringify(queryResult));
          let anMenuItem = queryResult[0];
          anMenuItemImage = anMenuItem.menuItemImage;
      }
    }
    
    function base64_encode(file) {
      var bitmap = fs.readFileSync(file);
      return new Buffer(bitmap).toString('base64');
    }

    if (queryResult) {
      if (table === "restaurantTable") {
        filename = queryResult.restaurantImage;
      } else if (table === 'buyerTable') {
        filename = queryResult.buyerImage;
      } else {
        filename = anMenuItemImage;
      }
      console.log("filename")
      console.log(filename);
      if (filename === null || filename === undefined) {
          res.status(400).json({ responseMessage: 'Record not found' });  
      } else {
        let filePath = path.join(__dirname, "../uploads/profilePictures", filename);
        console.log("file path.." + filePath);
        var base64str = base64_encode(filePath);
        res.status(200).json({ base64str: base64str });
      }
    }
    else {
      res.status(400).json({ responseMessage: 'Record not found' });
    }
  }
  try {
    getProfilepic();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});

router.get('/buyerDetails', function (req, res) {
  let buyerId = req.query.buyerId;
  var buyerDetailsResult = [];

  const getBuyerDetails = async () => {
    buyerDetailsResult = await LoginSignUpDBObj.getBuyerDetails("buyerTable", buyerId);
    if (buyerDetailsResult) {
      let detailsResult = buyerDetailsResult[0];
      if (detailsResult) {
        buyerDetails = {
          buyerId: buyerId,
          buyerName: detailsResult.buyerName,
          buyerEmailId: detailsResult.buyerEmailId,
          buyerPhone: detailsResult.buyerPhone,
          buyerAddress: detailsResult.buyerAddress,
        }
      }
      res.status(200).json({
        responseMessage: 'Found one or more buyer that matched',
        buyerDetails: buyerDetails,
      })
    }
  }

  try {
    getBuyerDetails();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({
      responseMessage: 'Database not responding',
      buyerDetails: undefined,
    });
  }
});

module.exports = router;