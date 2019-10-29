const express = require('express');
const mountRoutes = require('.');
const sha1 = require('sha1');
//const LoginSignUpDB = require('../../grubhub-backend/src/routes/LoginSignUpDB');
//const LoginSignUpDBObj = new LoginSignUpDB();

var crypt = require('./bcrypt.js');
var Buyers = require('../models/BuyerSchema');


var app = express();
app.set('view engine', 'ejs');

router = express.Router();

exports.loginSignupService = function loginSignupService(msg, callback) {
    console.log("e path:", msg.path);
    switch (msg.path) {
        case "buyerSignup":
            buyerSignup(msg, callback);
            break;
        case "buyerSignIn":
            buyerSignIn(msg, callback);
            break;
        case "ownerSignup":
            ownerSignup(msg, callback);
            break;
        case "ownerSignIn":
            ownerSignIn(msg, callback);
            break;    
    }
};

function buyerSignup(msg, callback) {

    console.log("In buyer Signup topic service. Msg: ", msg);
    Buyers.findOne({ email: msg.formatEmail }, function (err, rows) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            if (rows) {
                console.log("User already exists");
                callback(null, { status: 401, rows });
            } else {
                crypt.newHash(msg.body.password, function (response) {
                    enPassword = response;
                    console.log("Encrypted password: " + enPassword);
                    var table = "buyerTable"
                   // var role = (msg.body.isFaculty) ? "faculty" : "student";
                    var userData = {
                        "buyerName": msg.body.name,
                        "email": msg.formatEmail,
                        "password": enPassword,
                        "phoneNumber": msg.phoneNumber,
                        "address": msg.address
                       
                    }
                    //Save the user in database
                    Buyers.create(userData, function (err, user) {
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
    Buyers.findOne({ email: msg.formatEmail, table: table }, function (err, user) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "unable to read the database");
        } else if (user) {
            console.log("user:", user)
            crypt.compareHash(msg.body.password, user.password, function (err, isMatch) {
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

    console.log("In buyer Signup topic service. Msg: ", msg);
    Buyers.findOne({ email: msg.formatEmail }, function (err, rows) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            if (rows) {
                console.log("User already exists");
                callback(null, { status: 401, rows });
            } else {
                crypt.newHash(msg.body.password, function (response) {
                    enPassword = response;
                    console.log("Encrypted password: " + enPassword);
                    var table = "buyerTable"
                   // var role = (msg.body.isFaculty) ? "faculty" : "student";
                    var userData = {
                        "buyerName": msg.body.name,
                        "buyerEmail": msg.formatEmail,
                        "buyerPassword": enPassword,
                        "phoneNumber": msg.phoneNumber,
                        "address": msg.address
                       
                    }
                    //Save the user in database
                    Buyers.create(userData, function (err, user) {
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

    console.log("In login topic service. Msg: ", msg);
    Buyers.findOne({ email: msg.formatEmail, table: table }, function (err, user) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "unable to read the database");
        } else if (user) {
            console.log("user:", user)
            crypt.compareHash(msg.body.password, user.password, function (err, isMatch) {
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


module.exports = router;