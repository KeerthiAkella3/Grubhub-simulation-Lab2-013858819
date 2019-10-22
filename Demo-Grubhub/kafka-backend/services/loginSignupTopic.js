var crypt = require('./bcrypt.js');
var Users = require('../models/UserSchema');

exports.loginSignupService = function loginSignupService(msg, callback) {
    console.log("In Login Signup Service path:", msg.path);
    switch (msg.path) {
        case "userSignup":
            userSignup(msg, callback);
            break;
        case "login":
            login(msg, callback);
            break;
    }
};

function userSignup(msg, callback) {

    console.log("In userSignup topic service. Msg: ", msg);
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
                crypt.newHash(msg.body.password, function (response) {
                    enPassword = response;
                    console.log("Encrypted password: " + enPassword);
                    var role = (msg.body.isFaculty) ? "faculty" : "student";
                    var userData = {
                        "name": msg.body.name,
                        "email": msg.formatEmail,
                        "password": enPassword,
                        "role": role
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

function login(msg, callback) {

    console.log("In login topic service. Msg: ", msg);
    var role = (msg.body.isFaculty) ? "faculty" : "student";
    Users.findOne({ email: msg.formatEmail, role: role }, function (err, user) {
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