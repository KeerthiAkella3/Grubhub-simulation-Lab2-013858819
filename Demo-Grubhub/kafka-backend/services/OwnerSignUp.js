const express = require('express');
const mountRoutes = require('.');
const sha1 = require('sha1');
//const LoginSignUpDB = require('../../grubhub-backend/src/routes/LoginSignUpDB');
//const LoginSignUpDBObj = new LoginSignUpDB();


var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');


router = express.Router();


router.post('/ownerSignUp',function (req, res) {
  console.log("Inside owner signup post request");
  console.log("Request Body:");
  console.log(req.body);
  let password = req.body.restaurantPassword;
  console.log(password);
  let encryptedPassword = sha1(password);
  console.log("Encrypted password: "+encryptedPassword);
  var queryResult = [];
  const createUserIfNotPresent = async () => {
    queryResult = await LoginSignUpDBObj.checkIfRestaurantExists("restaurantTable", req.body.restaurantEmailId);
    console.log(queryResult);
    if(queryResult[0]){
      if(queryResult[0].restaurantEmailId != null){
        console.log("User already exists!");
        res.status(200).json({responseMessage: 'User already exists!'});
      }
    } else{
      var inputData = {
        restaurantName: req.body.restaurantName,
        restaurantEmailId: req.body.restaurantEmailId,
        restaurantPassword: encryptedPassword,
        restaurantPhone: req.body.restaurantPhone,
        restaurantAddress:req.body.restaurantAddress,
        restaurantCuisine: req.body.restaurantCuisine,
      }

      queryResult = await LoginSignUpDBObj.createNewOwner("restaurantTable", inputData);
      console.log("User Added");
      console.log(queryResult);
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


 
  