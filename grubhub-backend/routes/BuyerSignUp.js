const express = require('express');
const mountRoutes = require('.');
const sha1 = require('sha1');
const LoginSignUpDB = require('../database/LoginSignUpDB');
const LoginSignUpDBObj = new LoginSignUpDB();


var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');


router = express.Router();


router.post('/buyerSignUp',function (req, res) {
  console.log("Inside buyer signup post request");
  console.log("Request Body:");
  console.log(req.body);
  let password = req.body.buyerPassword;
  console.log(password);
  let encryptedPassword = sha1(password);
  console.log("Encrypted password: "+encryptedPassword);
  var queryResult = [];
  const createUserIfNotPresent = async () => {
    queryResult = await LoginSignUpDBObj.checkIfBuyerExists("buyerTable",req.body.buyerEmailId);
    //console.log(" buyersign up query result"+queryResult);
    if(queryResult[0]){
      if(queryResult[0].buyerEmailId != null){
        console.log("User already exists!");
        res.status(200).json({responseMessage: 'User already exists!'});
      }
    }
    else{
      var inputData = {
        "buyerName": req.body.buyerName,
        "buyerEmailId": req.body.buyerEmailId,
        "buyerPassword": encryptedPassword,
        "buyerPhone": req.body.buyerPhone,
        "buyerAddress": req.body.buyerAddress,
      }
      queryResult = await LoginSignUpDBObj.createNewBuyer("buyerTable",inputData);
      console.log("User Added");
      res.status(200).json({responseMessage: 'Successfully Added!'});
    }
  }

  try{
    createUserIfNotPresent();
  }
  catch(err){
    console.log(err);
    res.status(500).json({responseMessage: 'Database not responding'});
  }
});

module.exports = router;