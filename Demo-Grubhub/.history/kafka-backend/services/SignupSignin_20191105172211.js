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
var exports = module.exports = {};

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
        case "restaurantProfile":
            restaurantDetails(msg, callback);
            break;
        case "buyerProfile":
            buyerDetails(msg, callback);
            break;

        case "updateBuyerProfile":
            updateBuyerProfile(msg, callback);
            break;
        case "updateRestaurantProfile":
            updateRestaurantProfile(msg, callback);
            break;

        case "uploadRestaurantPicture":
            uploadRestaurantPicture(msg, callback);
            break;
        case "uploadBuyerPicture":
            uploadBuyerPicture(msg, callback);
            break;

        case "getRestaurantPicture":
            getRestaurantPicture(msg, callback);
            break
        case "getBuyerPicture":
            getBuyerPicture(msg, callback);
            break

        case "removeBuyerPicture":
            removeBuyerPicture(msg, callback);
            break;
        case "removeRestaurantPicture":
            removeRestaurantPicture(msg, callback);
            break;

        
        case "uploadItemPicture":
            uploadItemPicture(msg, callback);
            break;

        case "getItemPicture":
            getItemPicture(msg, callback);
            break


        case "removeItemPicture":
            removeItemPicture(msg, callback);
            break;
    }
};

function buyerDetails(msg, callback) {
    Users.findOne({ _id: msg.buyerId }, function (err, result) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "unable to read the database");
        } else if (result) {
            console.log("buyer from mongoDB:", result);
            callback(null, { status: 200, result });
        } else {
            callback(null, { status: 400 });
        }
    });
}

function restaurantDetails(msg, callback) {
    console.log("In restaurantDetails. Msg: ")
    console.log(msg)
    Restaurant.findOne({ '_id': msg.restaurantId }, function (err, result) {
        console.log(result)
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "unable to read the database");
        } else if (result) {
            console.log("restaurant from mongoDB:", result);
            callback(null, { status: 200, result });
        } else {
            callback(null, { status: 400 });
        }
    });
}


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
                    callback(null, { status: 200, user });
                    console.log("creating token");
                } else {
                    console.log("Authentication failed. Passwords did not match");
                    callback(null, { status: 400 });
                }
            })
        } else {
            callback(null, { status: 400 });
        }
    });

}

function ownerSignup(msg, callback) {
    console.log("In restaurant Signup topic service. Msg: ", msg);
    Restaurant.findOne({ restaurantEmail: msg.formatEmail }, function (err, rows) {
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
                        "restaurantEmail": msg.formatEmail,
                        "restaurantPassword": enPassword,
                        "restaurantPhoneNumber": msg.body.restaurantPhone,
                        "restaurantAddress": msg.body.restaurantAddress,
                        "cuisine": msg.body.restaurantCuisine

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
    Restaurant.findOne({ restaurantEmail: msg.formatEmail }, function (err, user) {

        if (err) {

            console.log(err);
            console.log("unable to read the database");
            callback(err, "unable to read the database");
        } else if (user) {
            console.log("user:", user)
            crypt.compareHash(msg.body.restaurantPassword, user.restaurantPassword, function (err, isMatch) {
                if (isMatch && !err) {
                    console.log("Login Successful");
                    callback(null, { status: 200, user });
                    console.log("creating token");
                } else {
                    console.log("Authentication failed. Passwords did not match");
                    callback(null, { status: 400 });
                }
            })
        } else {
            callback(null, { status: 400 });
        }
    });
}

function updateBuyerProfile(msg, callback) {

    console.log("In buyer update profile. Msg: ", msg);
    Users.findOneAndUpdate({ '_id': msg.id }, {
        $set:
        {
            "buyerName": msg.body.buyerName,
            "buyerEmail": msg.body.buyerEmailId,
            "buyerPhoneNumber": msg.body.buyerPhone,
            "buyerAddress": msg.body.buyerAddress
        }
    }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("results:", results);
                callback(null, { status: 200 });
            }
            else {
                console.log("No results found");
                callback(null, { status: 205 });
            }
        }
    });
}

function updateRestaurantProfile(msg, callback) {

    console.log("In restaurant update profile. Msg: ", msg);
    Restaurant.findOneAndUpdate({ '_id': msg.id }, {
        $set:
        {
            "restaurantName": msg.body.owerName,
            "restaurantEmail": msg.body.buyerEmailId,
            "restaurantPhoneNumber": msg.body.buyerPhone,
            "restaurantAddress": msg.body.buyerAddress,
            "cuisine": msg.body.cuisine

        }
    }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("results:", results);
                callback(null, { status: 200 });
            }
            else {
                console.log("No results found");
                callback(null, { status: 205 });
            }
        }
    });
}


function uploadBuyerPicture(msg, callback) {

    console.log("In uploadBuyerPicture profile pic. Msg: ", msg);
    console.log("id")
    console.log(msg.body.id)
    Users.findOneAndUpdate({ '_id': msg.body.id }, {
        $set:
            { "buyerImg": msg.filename }
    }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("results:", results.buyerImg);
                callback(null, { status: 200 });
            }
            else {
                console.log("No results found");
                callback(null, { status: 205 });
            }
        }
    });
}

function uploadRestaurantPicture(msg, callback) {

    console.log("In uploadRestaurantPicture profile pic. Msg: ", msg);
    console.log("id")
    console.log(msg.body.id)
    Restaurant.findOneAndUpdate({ _id: msg.body.id }, {
        $set:
            { "restaurantImg": msg.filename }
    }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("results:", results.restaurantImg);
                callback(null, { status: 200 });
            }
            else {
                console.log("No results found");
                callback(null, { status: 205 });
            }//5dbcfa8a3938cc4242385755
        }
    });
}


function getRestaurantPicture(msg, callback) {

    console.log("In get getRestaurantPicture profile. Msg: ", msg);

    Restaurant.findOne({ _id: msg.body.id }, function (err, results) {
        // console.log("raaave")
        console.log(results)

        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("results:");
                callback(null, { status: 200, img: results.restaurantImg });
            }
            else {
                console.log("No results found");
                callback(null, { status: 205 });
            }
        }
    });
}

function getBuyerPicture(msg, callback) {

    console.log("In get getBuyerPicture profile. Msg: ", msg);

    Users.findOne({ '_id': msg.body.id }, function (err, results) {
        console.log("results in kafka backend for images")
        console.log(results)
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("results:", results);
                callback(null, { status: 200, img: results.buyerImg });
            }
            else {
                console.log("No results found");
                callback(null, { status: 205 });
            }
        }
    });
}


function uploadItemPicture(msg, callback) {

    console.log("In uploadItemPicture profile pic. Msg: ", msg);
    console.log("id")
    console.log(msg.body.id)
    // Restaurant.findOneAndUpdate({ '_id': msg.body.id }, {
    //     $set:
    //         { "buyerImg": msg.filename }
    // }, function (err, results) {
    //     if (err) {
    //         console.log(err);
    //         callback(err, "Database Error");
    //     } else {
    //         if (results) {
    //             console.log("results:", results.buyerImg);
    //             callback(null, { status: 200 });
    //         }
    //         else {
    //             console.log("No results found");
    //             callback(null, { status: 205 });
    //         }
    //     }
    // });
}

function getItemPicture(msg, callback) {

    console.log("In get getItemPicture profile. Msg: ", msg);

    Restaurant.findOne({ _id: msg.body.id }, function (err, results) {
        // console.log("raaave")
        console.log(results)

        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("results:");
                callback(null, { status: 200, img: results.restaurantImg });
            }
            else {
                console.log("No results found");
                callback(null, { status: 205 });
            }
        }
    });
}


//module.exports = router;