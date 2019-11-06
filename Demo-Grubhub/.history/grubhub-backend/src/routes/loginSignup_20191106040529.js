const express = require('express');

var app = express();
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
  
  kafka.make_request('loginSignuptopic',{"path":"buyerLogin", "formatEmail": formatEmail, "body": req.body}, function(err,result){
    if (err) {
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("result:", result);
      // Create token if the password matched and no error was thrown
      var token = jwt.sign({ id: result.user._id, email: result.user.buyerEmail }, config.secret_key, {
        expiresIn: 7200 // expires in 2 hours
      });

      req.session.user = result.user.buyerEmail;
      res.cookie("cookie1",result.user._id,{maxAge: 900000, httpOnly: false, path : '/'});
      res.cookie("cookie2",result.user.buyerName,{maxAge: 900000, httpOnly: false, path : '/'});
      res.cookie("cookie3",result.user.buyerEmail,{maxAge: 900000, httpOnly: false, path : '/'});
      
      res.status(200).json({ validUser: true, token: token, user_type:"buyer", id:result.user._id, cookies: { cookie1: result.user._id, cookie2: result.user.buyerEmail, cookie3: result.user.buyerName }  });
      console.log("User found in DB and token is", token);
    
      //console.log("cookies")
    //  console.log(cookie.load('cookie1'))

    } else if (result.status === 400){
      res.status(200).json({ validUser: false });
      console.log("Authentication failed. User does not exist.");
    }
  })
})

router.post('/ownerSignup', function (req, res) {
  console.log("Inside signup post request");
  console.log("Sending Request Body:");
  console.log(req.body);
  let formatEmail = req.body.restaurantEmailId.toLowerCase().trim();
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


router.post('/ownerSignin', function (req, res) {
  console.log("Inside login post request");
  console.log("Request Body:");
  console.log(req.body);
  formatEmail = req.body.restaurantEmailId.toLowerCase().trim();
  console.log("formatted email:" + formatEmail);
  
  kafka.make_request('loginSignuptopic',{"path":"ownerSignin", "formatEmail": formatEmail, "body": req.body}, function(err,result){
    if (err) {
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result)
    {
      console.log("result:", result);
      // Create token if the password matched and no error was thrown
      var token = jwt.sign({ id: result.user._id, email: result.user.retaurantEmail }, config.secret_key, {
        expiresIn: 7200 // expires in 2 hours
      });
      req.session.user = result.user.retaurantEmail;
      res.cookie("cookie1",result.user._id,{maxAge: 900000, httpOnly: false, path : '/'});
      res.cookie("cookie2",result.user.restaurantName,{maxAge: 900000, httpOnly: false, path : '/'});
      res.cookie("cookie3",result.user.retaurantEmail,{maxAge: 900000, httpOnly: false, path : '/'});
      res.status(200).json({ validUser: true, token: token,user_type:"owner", id:result.user._id, cookies: {cookie1: result.user._id, cookie2: result.user.restaurantName, cookie3: result.user.retaurantEmail }  });
      
      console.log("User found in DB and token is", token);

    } else if (result.status === 400){
      res.status(200).json({ validUser: false });
      console.log("Authentication failed. User does not exist.");
    }
  })
});

function buyerProfile(msg, callback) {

  console.log("In get buyerProfile profile. Msg: ", msg);

  Users.findOne({ '_id': msg.body.id }, { 'courses': 0, 'password': 0 }, function (err, results) {
      if (err) {
          console.log(err);
          callback(err, "Database Error");
      } else {
          if (results) {
              console.log("results:", results);
              callback(null, { status: 200, profile: results });
          }
          else {
              console.log("No results found");
              callback(null, { status: 205 });
          }
      }
  });
}

function restaurantProfile(msg, callback) {

  console.log("In get restaurantProfile profile. Msg: ", msg);

  Restaurant.findOne({ '_id': msg.body.id }, { 'courses': 0, 'password': 0 }, function (err, results) {
      if (err) {
          console.log(err);
          callback(err, "Database Error");
      } else {
          if (results) {
              console.log("results:", results);
              callback(null, { status: 200, profile: results });
          }
          else {
              console.log("No results found");
              callback(null, { status: 205 });
          }
      }
  });
}



function getProfileImg(msg, callback) {

  console.log("In get user profile. Msg: ", msg);

  Users.findOne({ '_id': msg.body.id, 'role': msg.body.role }, {'_id': 0, 'img':1}, function (err, results) {
      if (err) {
          console.log(err);
          callback(err, "Database Error");
      } else {
          if (results) {
              console.log("results:", results);
              callback(null, { status: 200, img: results.img });
          }
          else {
              console.log("No results found");
              callback(null, { status: 205 });
          }
      }
  });
}

function updateProfile(msg, callback) {

  console.log("In update profile. Msg: ", msg);
  Users.findOneAndUpdate({ '_id': msg.body.id, 'role': msg.body.role }, { $set:
      {
          "name": msg.body.name,
          "img": msg.body.img,
          "phoneNumber": parseInt(msg.body.phoneNumber),
          "aboutMe":msg.body.aboutMe,
          "company":msg.body.company,
          "city":msg.body.city,
          "country": msg.body.country,
          "school": msg.body.school,
          "hometown": msg.body.hometown,
          "languages": msg.body.languages,
          "gender": msg.body.gender,
        }
  }, function (err, results) {
      if (err) {
          console.log(err);
          callback(err, "Database Error");
      } else {
          if (results) {
              console.log("results:", results);
              callback(null, {status: 200});
          }
          else {
              console.log("No results found");
              callback(null, { status: 205 });
          }
      }
  });
}

function uploadProfilePic(msg, callback) {

  console.log("In upload profile pic. Msg: ", msg);
  Users.findOneAndUpdate({ '_id': msg.body.id, 'role': msg.body.role }, { $set: {"img": msg.filename } }, function (err, results) {
      if (err) {
          console.log(err);
          callback(err, "Database Error");
      } else {
          if (results) {
              console.log("results:", results);
              callback(null, {status: 200});
          }
          else {
              console.log("No results found");
              callback(null, { status: 205 });
          }
      }
  });
}

function removeProfilePic(msg, callback){
  console.log("In remove profile pic. Msg: ", msg);
  Users.findOneAndUpdate({ '_id': msg.body.id, 'role': msg.body.role }, { $set: {"img": "" } }, function (err, results) {
      if (err) {
          console.log(err);
          callback(err, "Database Error");
      } else {
          if (results) {
              console.log("results:", results);
              callback(null, {status: 200});
          }
          else {
              console.log("No results found");
              callback(null, { status: 205 });
          }
      }
  });
}

module.exports = router