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


router.post('/postOrder', function (req, res) {
    console.log("In backend, posting a new order");
    console.log(req.query);
    console.log(req);
    let newOrderData = req.body;
    kafka.make_request('ordersTopic', { "path": "placeOrder", "orderData": newOrderData }, function (err, result) {
        console.log("result from get menu in menu item manage")
        console.log(result);
        if (err || result.orderId === undefined) {
            res.status(500).json({
                responseMessage: 'Failed to place an Order!',
                orderId: undefined
            });

        } else if (result.orderId !== undefined) {
            res.status(200).json({
                responseMessage: 'Placed an order Successfully in backend!!',
                orderId: result.orderId,
            })
        }
    })

})

router.get('/getBuyerOrder', function(req, res) {
    console.log('In backend, getting buyer order details');
    console.log(req.query);
    let buyerEmailId = req.query.buyerEmailId;
    if (buyerEmailId !== undefined) {
        kafka.make_request('ordersTopic', {
            "path" : "getBuyerOrder",
            "buyerEmailId" : buyerEmailId,
        },
        function (err, result) {
            if (err || result.allOrderData === undefined) {
                res.status(500).json({
                    responseMessage: 'Failed to get order details from kafka backend!',
                    allOrderData: undefined
                });
    
            } else if (result.allOrderData !== undefined) {
                res.status(200).json({
                    responseMessage: 'Getting buyer order details!!',
                    allOrderData: result.allOrderData,
                })
            }  
        })
    } else {
        res.status(500).json({
            responseMessage: 'Invalid buyer email Id from front-end',
            allOrderData : undefined,
        })
    }
});

router.get('/restaurantOrders', function(req, res) {
    console.log(req.query);
    let restaurantId =  req.query.restaurantId;
    let restaurantOrderStatus = req.query.orderStatus;
    if (restaurantId === undefined || restaurantOrderStatus === undefined) {
        res.status(500).json({
            responseMessage: "Invalid restaurantId or Invalid restaurant order status.",
            orderDetails: undefined,
        })
    } else {
        kafka.make_request('ordersTopic', {
            "path" : "getRestaurantOrders",
            "restaurantOrderStatus" : restaurantOrderStatus,
            "restaurantId" : restaurantId,
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

router.delete('/deleteOrder', function(req, res) {
    console.log(req.query);
    let uniqueOrderId = req.query.uniqueOrderId;
    kafka.make_request('ordersTopic', {
        "path" : "deleteRestaurantOrders",
        "uniqueOrderId" : uniqueOrderId,
    }, function(err, result) {
        if (err || result.success === false) {
            res.status(500).json({
                responseMessage: 'Failed to delete order ' + uniqueOrderId + ' from kafka backend!',
            });

        } else if (result.success === true) {
            res.status(200).json({
                responseMessage: 'Successfully deleted order on kafka backend',
            })
        } 
    })
});

router.post('/updateOrder', function(req,res) {
    console.log(req);
    let uniqueOrderId = req.data.uniqueOrderId;
    let newStatus = req.data.nextStatus;
    kafka.make_request('ordersTopic', {
        "path" : "updateRestaurantOrder",
        "uniqueOrderId" : uniqueOrderId,
        "newStatus" : newStatus,
    }, function(err, result) {
        if (err || result.success === false) {  
            res.status(500).json({
                responseMessage: 'Failed to updated order ' + uniqueOrderId + ' from kafka backend!',
            });

        } else if (result.success === true) {
            res.status(200).json({
                responseMessage: 'Successfully updated order on kafka backend',
            })
        } 
    })

});

module.exports = router;