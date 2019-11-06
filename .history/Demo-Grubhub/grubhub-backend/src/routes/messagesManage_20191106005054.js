const express = require('express');
const path = require('path');
var fs = require('fs');
const multer = require('multer');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var app = express();
app.set('view engine', 'ejs');
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', { session: false });
var config = require('../../config/settings');
var kafka = require('../kafka/client');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads/profilePictures');
    },
    filename: (req, file, callback) => {
        fileExtension = file.originalname.split('.')[1];
        console.log("fileExtension", fileExtension);
        callback(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + fileExtension);
    },
});
var upload = multer({ storage: storage });
router = express.Router();

router.get('/getMessages', function(req, res) {
    console.log(req.query);
    let fromId =  req.query.fromId;
    let toId = req.query.toId;
    if (fromId === undefined || toId === undefined) {
        res.status(500).json({
            responseMessage: "Invalid restaurantId or Invalid restaurant order status.",
            orderDetails: undefined,
        })
    } else {
        kafka.make_request('ordersTopic', {
            "path" : "getMessages",
            "fromId" : fromId,
            "toId" : toId,
        }, function(err, result){
            if (err || result.allOrderData === undefined) {
                res.status(500).json({
                    responseMessage: 'Failed to get restaurant order details from kafka backend!',
                    orderDetails: undefined
                });
    
            } else if (result.allOrderData !== undefined) {
                res.status(200).json({
                    responseMessage: 'Getting restaurant order details!!',
                    orderDetails: result.allOrderData,
                })
            }  
        })
    }
});

router.post('/sendMessage', function(req,res) {
    console.log(req);
    let fromId = req.body.uniqueOrderId;
    let toId = req.body.nextStatus;
    let message = req.body.message; 
    kafka.make_request('messagesTopic', {
        "path" : "sendMessage",
        "fromId" : fromId,
        "toId" : toId,
        "message" : message,
    }, function(err, result) {
        if (err || result.success === false) {  
            res.status(500).json({
                responseMessage: 'Failed to save conversation!',
            });

        } else if (result.success === true) {
            res.status(200).json({
                responseMessage: 'Successfully added message to mongodb',
            })
        } 
    })

});

module.exports = router;