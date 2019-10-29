const express = require('express');

var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');

router = express.Router();

//imports
var config = require('../../config/settings');
var kafka = require('../kafka/client');

// Set up middleware
var jwt = require('jsonwebtoken');
var passport = require('passport');


router.post('/buyerSignup', function (req, res) {
  console.log("Inside signup post request");
  console.log("Sending Request Body:");
  console.log(req.body);
  let formatEmail = req.body.buyerEmailId.toLowerCase().trim();
  console.log("formatted email:" + formatEmail);

  kafka.make_request('loginSignuptopic',{"path":"buyerSignup", "formatEmail": formatEmail, "body": req.body}, function(err,result){
   console.log("result")
   console.log(result)
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result)
    {

      console.log("User Added");
      res.status(200).json({ responseMessage: 'Successfully Added!' });
    } else if (result.status === 401){
      console.log("User already exists");
      res.status(200).json({ responseMessage: 'User Already exists!' });
    }
  });

});


router.post('/buyerLogin', function (req, res) {
  console.log("Inside login post request");
  console.log("Request Body:");
  console.log(req.body);
  formatEmail = req.body.buyerEmailId.toLowerCase().trim();
  console.log("formatted email:" + formatEmail);
  
  kafka.make_request('loginSignup_topics',{"path":"login", "formatEmail": formatEmail, "body": req.body}, function(err,result){
    if (err) {
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("result:", result);
      // Create token if the password matched and no error was thrown
      var token = jwt.sign({ id: result.user._id, email: result.user.email }, config.secret_key, {
        expiresIn: 7200 // expires in 2 hours
      });
      req.session.user = result.user.email;
      res.status(200).json({ validUser: true, token: token, cookies: { cookie1: result.user.role, cookie2: result.user._id, cookie3: result.user.name, cookie4: result.user.email  }  });
      console.log("User found in DB and token is", token);

    } else if (result.status === 400){
      res.status(200).json({ validUser: false });
      console.log("Authentication failed. User does not exist.");
    }
  })

router.post('/ownerSignup', function (req, res) {
  console.log("Inside signup post request");
  console.log("Sending Request Body:");
  console.log(req.body);
  let formatEmail = req.body.buyerEmailId.toLowerCase().trim();
  console.log("formatted email:" + formatEmail);

  kafka.make_request('loginSignuptopic',{"path":"buyerSignup", "formatEmail": formatEmail, "body": req.body}, function(err,result){
   console.log("result")
   console.log(result)
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result)
    {

      console.log("User Added");
      res.status(200).json({ responseMessage: 'Successfully Added!' });
    } else if (result.status === 401){
      console.log("User already exists");
      res.status(200).json({ responseMessage: 'User Already exists!' });
    }
  });

});


router.post('/ownerSignin', function (req, res) {
  console.log("Inside login post request");
  console.log("Request Body:");
  console.log(req.body);
  formatEmail = req.body.buyerEmailId.toLowerCase().trim();
  console.log("formatted email:" + formatEmail);
  
  kafka.make_request('loginSignup_topics',{"path":"login", "formatEmail": formatEmail, "body": req.body}, function(err,result){
    if (err) {
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("result:", result);
      // Create token if the password matched and no error was thrown
      var token = jwt.sign({ id: result.user._id, email: result.user.email }, config.secret_key, {
        expiresIn: 7200 // expires in 2 hours
      });
      req.session.user = result.user.email;
      res.status(200).json({ validUser: true, token: token, cookies: { cookie1: result.user.role, cookie2: result.user._id, cookie3: result.user.name, cookie4: result.user.email  }  });
      console.log("User found in DB and token is", token);

    } else if (result.status === 400){
      res.status(200).json({ validUser: false });
      console.log("Authentication failed. User does not exist.");
    }
  })
});




module.exports = router