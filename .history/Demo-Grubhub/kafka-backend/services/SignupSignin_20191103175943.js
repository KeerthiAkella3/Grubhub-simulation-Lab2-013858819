const express = require('express');
const mountRoutes = require('.');
const sha1 = require('sha1');
//const LoginSignUpDB = require('../../grubhub-backend/src/routes/LoginSignUpDB');
//const LoginSignUpDBObj = new LoginSignUpDB();

var crypt = require('./bcrypt.js');
var Users = require('../models/UserSchema');
var Restaurant = require('../models/RestaurantSchema');

var app = express();
app.set('view engine', 'ejs');

router = express.Router();
var exports = module.exports= {};

exports.loginSignupService = function loginSignupService(msg, callback) {
    console.log("e path:", msg.path);
    switch (msg.path) {
        case "buyerSignup":
            buyerSignup(msg, callback);
            break;
        case "buyerLogin":
            buyerSignIn(msg, callback);
            break;
        case "ownerSignup":
            ownerSignup(msg, callback);
            break;
        case "ownerSignin":
            ownerSignIn(msg, callback);
            break;
        case "ownerDetails":
            ownerDetails(msg, callback);
            break;
        case "buyerDetails":
            buyerDetails(msg, callback);
            break;    
    }
};

function buyerSignup(msg, callback) {

    console.log("In buyer Signup topic service. Msg: ", msg);
    Users.findOne({ email: msg.formatEmail }, function (err, rows) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            if (rows) {
                console.log("User already exists");
                callback(null, { status: 401, rows });
            } else {
                crypt.newHash(msg.body.buyerPassword, function (response) {
                    enPassword = response;
                    console.log("Encrypted password: " + enPassword);
                    var userData = {
                        "buyerName": msg.body.buyerName,
                        "buyerEmail": msg.formatEmail,
                        "buyerPassword": enPassword,
                        "buyerPhoneNumber": msg.body.buyerPhone,
                        "buyerAddress": msg.body.buyerAddress
                       
                    }
                    //Save the user in database
                    Users.create(userData, function (err, user) {
                        if (err) {
                            console.log("unable to insert into database", err);
                            callback(err, "Database Error");
                        } else {
                            console.log("User Signup Successful");
                            callback(null, { status: 200, user });
                        }
                    });
                });
            }
        }
    });
}

function buyerSignIn(msg, callback) {

    console.log("In login topic service. Msg: ", msg);
    console.log("password check in buyer sign in")
    console.log(msg.body.buyerPassword)
    Users.findOne({ buyerEmail: msg.formatEmail }, function (err, user) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "unable to read the database");
        } else if (user) {
            console.log("user:", user)
            crypt.compareHash(msg.body.buyerPassword, user.buyerPassword, function (err, isMatch) {
                if (isMatch && !err) {
                    console.log("Login Successful");
                    callback(null, {status: 200, user});
                    console.log("creating token");
                } else {
                    console.log("Authentication failed. Passwords did not match");
                    callback(null, {status: 400});
                }
            })
        } else {
            callback(null, {status: 400});
        }
    });

}

function ownerSignup(msg, callback) {

    console.log("In restaurant Signup topic service. Msg: ", msg);
    Restaurant.findOne({ retaurantEmail: msg.formatEmail }, function (err, rows) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            if (rows) {
                console.log("User already exists");
                callback(null, { status: 401, rows });
            } else {
                crypt.newHash(msg.body.restaurantPassword, function (response) {
                    enPassword = response;
                    console.log("Encrypted password: " + enPassword);
                    //var table = "buyerTable"
                   // var role = (msg.body.isFaculty) ? "faculty" : "student";
                    var userData = {
                        "restaurantName": msg.body.restaurantName,
                        "retaurantEmail": msg.formatEmail,
                        "restaurantPassword": enPassword,
                        "restaurantPhoneNumber": msg.body.restaurantPhone,
                        "restaurantAddress": msg.body.restaurantAddress,
                        "cuisine":msg.body.restaurantCuisine
                       
                    }
                    //Save the user in database
                    Restaurant.create(userData, function (err, user) {
                        if (err) {
                            console.log("unable to insert into database", err);
                            callback(err, "Database Error");
                        } else {
                            console.log("User Signup Successful");
                            callback(null, { status: 200, user });
                        }
                    });
                    
                });
            }
        }
    });
}

function ownerSignIn(msg, callback) {

    console.log("In owner login topic service. Msg: ", msg);
    Restaurant.findOne({ retaurantEmail: msg.formatEmail}, function (err, user) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "unable to read the database");
        } else if (user) {
            console.log("user:", user)
            crypt.compareHash(msg.body.restaurantPassword, user.restaurantPassword, function (err, isMatch) {
                if (isMatch && !err) {
                    console.log("Login Successful");
                    callback(null, {status: 200, user});
                    console.log("creating token");
                } else {
                    console.log("Authentication failed. Passwords did not match");
                    callback(null, {status: 400});
                }
            })
        } else {
            callback(null, {status: 400});
        }
    });
}


//module.exports = router;
