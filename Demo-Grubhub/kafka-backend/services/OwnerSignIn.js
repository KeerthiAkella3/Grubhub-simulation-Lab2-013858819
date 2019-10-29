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


router.post('/ownerSignIn',function (req, res) {
  console.log("Inside owner login post request");
  console.log("Request Body:");
    console.log(req.body);
    formatEmail = req.body.restaurantEmailId.toLowerCase().trim();
    console.log("formatted email:"+formatEmail);
    let password = req.body.restaurantPassword;
    //console.log(password);
    let encryptedPassword = sha1(password);
    //console.log("Encrypted password: "+encryptedPassword);
  
    let queryResult = [];
    const checkuser = async () => {
     // console.log("in owner sign in " + req.body.emailId)
    queryResult = await LoginSignUpDBObj.ownerLogin("restaurantTable", formatEmail , encryptedPassword);
    console.log("query result " + queryResult[0].restaurantName);
    
  if (!queryResult[0]){
    console.log("Unable to find user");
    res.status(200).json({validUser: false});
  } else {
  if (queryResult[0].restaurantName != null) {
    console.log("User exists! Valid credentials");
    res.cookie('cookie1',formatEmail,{maxAge: 9000000, httpOnly: false, path : '/'});
    res.cookie('cookie2',queryResult[0].restaurantId,{maxAge: 9000000, httpOnly: false, path : '/'});
    res.cookie('cookie3',queryResult[0].restaurantName,{maxAge: 9000000, httpOnly: false, path : '/'});
    console.log("Added cookies");
    req.session.formatEmail = queryResult[0].restaurantEmailId;
    res.status(200).json({validUser: true});
  } 
  }
    }
    try{
      checkuser();
    }
    catch(err){
      console.log("unable to read the database");
       res.status(500).json({responseMessage: 'Database not responding'});
    }
});

module.exports = router;