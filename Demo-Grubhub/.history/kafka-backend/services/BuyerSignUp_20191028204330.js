
// var crypt = require('./bcrypt.js');
// var Buyers = require('../models/BuyerSchema');


// exports.loginSignupService = function loginSignupService(msg, callback) {
//     console.log("In buyer sign up Service path:", msg.path);
//     switch (msg.path) {
//         case "buyerSignUp":
//             buyerSignup(msg, callback);
//             break;
//         case "buyerSignIn":
//             buyerSignIn(msg, callback);
//             break;
//     }
// };

// function buyerSignup(msg, callback) {
//     console.log("object")
//     console.log("In userSignup topic service. Msg: ", msg);
//     Buyers.findOne({ email: msg.formatEmail }, function (err, rows) {
//         if (err) {
//             console.log(err);
//             console.log("unable to read the database");
//             callback(err, "Database Error");
//         } else {
//             if (rows) {
//                 console.log("User already exists");
//                 callback(null, { status: 401, rows });
//             } else {
//                 crypt.newHash(msg.body.password, function (response) {
//                     enPassword = response;
//                     console.log("Encrypted password: " + enPassword);
//                   //  var table = "buyerTable"
//                    // var role = (msg.body.isFaculty) ? "faculty" : "student";
//                    //console.log("msg response in buyer sign up")
//                   // console.log(msg.)
//                     var userData = {
//                         "name": msg.body.buyerName,
//                         "email": msg.formatEmail,
//                         "password": enPassword,
//                         "phoneNumber": msg.body.buyerPhone,
//                         "address": msg.body.buyerAddress
                       
//                     }
//                     //Save the user in database
//                     Buyers.create(userData, function (err, user) {
//                         if (err) {
//                             console.log("unable to insert into database", err);
//                             callback(err, "Database Error");
//                         } else {
//                             console.log("User Signup Successful");
//                             callback(null, { status: 200, responseMessage: "Successfully Added!", user });
//                         }
//                     });
//                 });
//             }
//         }
//     });
// }

// function buyerSignIn(msg, callback) {

//     console.log("In login topic service. Msg: ", msg);
//    // var role = (msg.body.isFaculty) ? "faculty" : "student";
//     var table = "buyerTable"
//     Buyers.findOne({ email: msg.formatEmail, table: table }, function (err, user) {
//         if (err) {
//             console.log(err);
//             console.log("unable to read the database");
//             callback(err, "unable to read the database");
//         } else if (user) {
//             console.log("user:", user)
//             crypt.compareHash(msg.body.password, user.password, function (err, isMatch) {
//                 if (isMatch && !err) {
//                     console.log("Login Successful");
//                     callback(null, {status: 200, user});
//                     console.log("creating token");
//                 } else {
//                     console.log("Authentication failed. Passwords did not match");
//                     callback(null, {status: 400});
//                 }
//             })
//         } else {
//             callback(null, {status: 400});
//         }
//     });

// }

