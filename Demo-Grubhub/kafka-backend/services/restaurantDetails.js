const express = require('express');
const mountRoutes = require('.');
const sha1 = require('sha1');
//const LoginSignUpDB = require('../../grubhub-backend/src/routes/LoginSignUpDB');
//const LoginSignUpDBObj = new LoginSignUpDB();


var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');

router = express.Router();


router.get('/restaurantDetails', function (req, res) {
  let restaurantId = req.query.restaurantId;
  var restaurantDetailsResult = [];

  const getBuyerDetails = async () => {
    restaurantDetailsResult = await LoginSignUpDBObj.getRestaurantDetails("restaurantTable", restaurantId);
    if (restaurantDetailsResult) {
        let detailsResult = restaurantDetailsResult[0];
        if (detailsResult) {
            restaurantDetails = {
                restaurantId : detailsResult.restaurantId,
                restaurantName: detailsResult.restaurantName,
                restaurantEmailId: detailsResult.restaurantEmailId,
                restaurantPhone: detailsResult.restaurantPhone,
                restaurantAddress: detailsResult.restaurantAddress,
                restaurantCuisine: detailsResult.restaurantCuisine,
            }
        }
        res.status(200).json({
            responseMessage: 'Found one or more buyer that matched',
            restaurantDetails: restaurantDetails,
        })
    }
  }

  try {
    getBuyerDetails();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({
      responseMessage: 'Database not responding',
      buyerDetails: undefined,
    });
  }


});

module.exports = router;