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
            responseMessage: "Failed to read converstation.",
            messages: undefined,
        })
    } else {
        kafka.make_request('ordersTopic', {
            "path" : "getMessages",
            "unqiueOrderId" : fromId,
            "toId" : toId,
        }, function(err, result){
            if (err || result.conversation === undefined) {
                res.status(500).json({
                    responseMessage: 'Failed to read conversation!',
                    messages: undefined
                });
    
            } else if (result.conversation !== undefined) {
                res.status(200).json({
                    responseMessage: 'Successfully read conversation!!',
                    messages: result.converstation,
                })
            }  
        })
    }
});

router.post('/sendMessageToOwner', function(req,res) {
    console.log(req);
    let buyerId = req.body.buyerId;
    let restaurantId = req.body.restaurantId;
    let uniqueOrderId = req.body.uniqueOrderId;
    let message = req.body.message; 
    kafka.make_request('ordersTopic', {
        "path" : "sendMessageToOwner",
        "buyerId" : buyerId,
        "restaurantId" : restaurantId,
        "uniqueOrderId": uniqueOrderId,
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

router.post('/sendMessageToBuyer', function(req,res) {
    console.log(req);
    let buyerId = req.body.buyerId;
    let restaurantId = req.body.restaurantId;
    let uniqueOrderId = req.body.uniqueOrderId;
    let message = req.body.message; 
    kafka.make_request('ordersTopic', {
        "path" : "sendMessageToBuyer",
        "buyerId" : buyerId,
        "restaurantId" : restaurantId,
        "uniqueOrderId": uniqueOrderId,
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