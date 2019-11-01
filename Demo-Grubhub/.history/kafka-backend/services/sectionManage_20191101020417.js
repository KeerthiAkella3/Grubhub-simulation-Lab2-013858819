const express = require('express');
const mountRoutes = require('.');
const sha1 = require('sha1');
//const LoginSignUpDB = require('../../grubhub-backend/src/routes/LoginSignUpDB');
//const LoginSignUpDBObj = new LoginSignUpDB();

var crypt = require('./bcrypt.js');
var Restaurant = require('../models/RestaurantSchema');


var app = express();
app.set('view engine', 'ejs');

router = express.Router();
var exports = module.exports= {};

exports.restaurantService = function restaurantService(msg, callback) {
    console.log("e path:", msg.path);
    switch (msg.path) {
        case "addSection":
            restaurantSection(msg, callback);
            break;
        case "getSection":
            menu(msg, callback);
            break;
        case "getMenu":
            ownerSignup(msg, callback);
            break;
        case "getAllItemMatch":
            getAllItemMatch(msg, callback);
            break;
        case "addMenuItem":
            addMenuItem(msg,callback)
            break;
        case "deleteMenuItem":
            deleteMenuItem(msg,callback)
            break
    }
};


// console.log("In restaurant Signup topic service. Msg: ", msg);
// Users.findOne({ retaurantEmail: msg.formatEmail }, function (err, rows) {
//     if (err) {
//         console.log(err);
//         console.log("unable to read the database");
//         callback(err, "Database Error");
//     } else {
//         if (rows) {
//             console.log("User already exists");
//             callback(null, { status: 401, rows });
//         } else {
//             crypt.newHash(msg.body.restaurantPassword, function (response) {
//                 enPassword = response;
//                 console.log("Encrypted password: " + enPassword);
//                 //var table = "buyerTable"
//                // var role = (msg.body.isFaculty) ? "faculty" : "student";
//                 var userData = {
//                     "restaurantName": msg.body.restaurantName,
//                     "retaurantEmail": msg.formatEmail,
//                     "restaurantPassword": enPassword,
//                     "restaurantPhoneNumber": msg.body.restaurantPhone,
//                     "restaurantAddress": msg.body.restaurantAddress,
//                     "cuisine":msg.body.restaurantCuisine
                   
//                 }
//                 //Save the user in database
//                 Users.create(userData, function (err, user) {
//                     if (err) {
//                         console.log("unable to insert into database", err);
//                         callback(err, "Database Error");
//                     } else {
//                         console.log("User Signup Successful");
//                         callback(null, { status: 200, user });
//                     }
//                 });
//             });
//         }
//     }
// });

function restaurantSection(msg, callback) {
  console.log("In restaurantSection service. Msg: ", msg);
  
  Restaurant.findOne({"_id": msg.restaurantId}, function(err,restaurant){
    if(restaurant){
      var section = {
        "sectionName":msg.body.sectionName,
        "items":{}
      }
      restaurant.sections.push(section)
    }

  })  
  

}

function getSection(msg, callback){
  console.log("In getSection service. Msg: ", msg)


}


/*
  * Call this endpoint from Restaurant Owner, when restaurant Owner is managing status of order
  * From new --> preparing --> ready --> delivered.
  */
// router.delete('/restaurantSection', function (req, res) {

//   let sectionName = req.query.sectionName;
//   let restaurantId = req.query.restaurantId;

//   const deleteSection = async () => {

//   //   getAllSectionsResult = await LoginSignUpDBObj.getSections("restaurantSectionTable");
//   //   if (getAllSectionsResult) {
//   //     console.log(getAllSectionsResult);
//   //     for (let index = 0; index < getAllSectionsResult.length; index++) {
//   //       let anSection = getAllSectionsResult[index];
//   //       console.log(anSection)
//   //       if (anSection.sectionName === sectionName && anSection.restaurantId === parseInt(restaurantId)) {
//   //         console.log('match found!')
//   //         sectionDeleteQuery = await LoginSignUpDBObj.deleteSection("restaurantSectionTable", anSection.sectionItemId);
//   //         if (sectionDeleteQuery === undefined) {
//   //           res.status(404).json({
//   //             responseMessage: 'Section Not Found!'
//   //           });
//   //         } else {
//   //           res.status(200).json({
//   //             responseMessage: "Section successfully Deleted!"
//   //           });
//   //         }
//   //         break;  
//   //       } else {
//   //         continue;
//   //       }
//   //     }
//   //   }
//     console.log("in delete section kafka")
//    }

//   try {
//     deleteSection();
//   }
//   catch (err) {
//     console.log(err);
//     res.status(503).json({ responseMessage: 'Database not responding' });
//   }
// });

module.exports = router;