var Users = require('../models/UserSchema');

exports.profileService = function profileService(msg, callback) {
    console.log("In profile Service path:", msg.path);
    switch (msg.path) {
        case "buyerProfile":
            buyerProfile(msg, callback);
            break;
        case "restaurantProfile":
            restaurantProfile(msg, callback);
            break;
        case "updateBuyerProfile":
            updateBuyerProfile(msg,callback);
            break;
        case "uploadPicture":
            uploadPicture(msg, callback);
            break;
        case "getPicture":
            getPicture(msg, callback);
            break;
        case "getPicture":
            getPicture(msg, callback);
            break;
    }
};


function getUserProfile(msg, callback) {

    console.log("In get user profile. Msg: ", msg);

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