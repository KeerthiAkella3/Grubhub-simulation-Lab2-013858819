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


router.post('/ownerSignup', function (req, res) {
  console.log("Inside signup post request");
  console.log("Sending Request Body:");
  console.log(req.body);
  let formatEmail = req.body.buyerEmailId.toLowerCase().trim();
  console.log("formatted email:" + formatEmail);

  kafka.make_request('loginSignuptopic',{"path":"ownerSignup", "formatEmail": formatEmail, "body": req.body}, function(err,result){
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

module.exports = router