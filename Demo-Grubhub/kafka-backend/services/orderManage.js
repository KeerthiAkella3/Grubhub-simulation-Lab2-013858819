const express = require('express');
const mountRoutes = require('.');
//const LoginSignUpDB = require('../../grubhub-backend/src/routes/LoginSignUpDB');
//const LoginSignUpDBObj = new LoginSignUpDB();


var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');

router = express.Router();

/*
  * Call this end-point when restaurant owner cancels an order.
*/
router.delete('/deleteOrder', function (req, res) {
  /*
  * To delete Order, we expect unique-ID assigned to this Order
  * Update restaurantOrderTable to delete this order entry
  * Update buyerOrderTable to update that this order was 'Rejected'
  * orderItemInfoTable will continue to list this order. 
  */

  let uniqueOrderId = req.query.uniqueOrderId;
  console.log("Deleting all records relevant to " + uniqueOrderId);
  let updateData = {
    uniqueOrderId: uniqueOrderId,
    orderStatus: 'Rejected',
  }
  var deleteEntryFromRestaurantOrderTable = [];
  const deleteOrder = async () => {
    deleteEntryFromRestaurantOrderTable = await LoginSignUpDBObj.updateOrderByRestaurant("restaurantOrderTable", updateData);
    if (deleteEntryFromRestaurantOrderTable.affectedRows != 1) {
      res.json({
        responseMessage: 'Order Not Found!'
      });
    }

    let status = "Past";
    rejectBuyerOrderTableEntry = await LoginSignUpDBObj.updateBuyerOrderTable("buyerOrderTable", uniqueOrderId, status)
    console.log(rejectBuyerOrderTableEntry);
    if (rejectBuyerOrderTableEntry && rejectBuyerOrderTableEntry.affectedRows != 1) {
      console.log("Entry not found in BuyerOrderTable");
    }

    // deleteOrderItemInfoEntry = await LoginSignUpDBObj.deletOrderFromOrderItemInfoTable("orderItemInfoTable", uniqueOrderId);
    // if (deleteOrderItemInfoEntry && deleteOrderItemInfoEntry.affectedRows != 1) {
    //   res.json({
    //     responseMessage: "Order could not be deleted from order items info table"
    //   })
    // } else {
    //   res.status(200).json({
    //     responseMessage: "Order successfully deleted from orderItemInfoTable"
    //   })
    // }
  }

  try {
    deleteOrder();
  }
  catch (err) {
    console.log(err);
    res.status(503).json({ responseMessage: 'Database not responding' });
  }
});

/**
 * buyer's name
 * buyer's address
 * order details
 *  --> items
 *  --> quantity
 *  --> price
 */
router.get('/restaurantOrders', function (req, res) {
  const getOrderDetails = async () => {
    console.log("Getting orders of restaurant with ID= " + req.query.restaurantId);
    console.log("Getting orders with status = " + req.query.orderStatus);
    let getOrderDetailsFromDB = await LoginSignUpDBObj.getOrderDetailsFromDB("restaurantOrderTable", req.query.restaurantId, req.query.orderStatus);
    let uniqueOrderId = 0;
    let finalResponseOrderDetails = [];
    let pIndex = 0;
    console.log(req.query)
    console.log(getOrderDetailsFromDB);
    for (pIndex = 0; pIndex < getOrderDetailsFromDB.length; pIndex++) {
      if (getOrderDetailsFromDB[pIndex] == undefined) {
        res.status(500).json({
          responseMessage: "Failed to get order details from restaurant order table.\n",
          orderDetails: undefined,
        })
      } else {
        let detailsResult = getOrderDetailsFromDB[pIndex];
        if (detailsResult
          && detailsResult.restaurantId === req.query.restaurantId
          && detailsResult.restaurantOrderStatus === req.query.orderStatus) {
          uniqueOrderId = detailsResult.uniqueOrderId;
          // Use unique order id to get information on items in order
          let orderItemInfoResult = [];
          let orderItemInfoDetails = await LoginSignUpDBObj.getOrderItemsInfo("orderItemInfoTable");
          if (orderItemInfoDetails) {
            let index = 0;
            for (index = 0; index < orderItemInfoDetails.length; index++) {
              let anOrderItemInfo = orderItemInfoDetails[index];
              if (anOrderItemInfo.uniqueOrderId === uniqueOrderId) {
                let tempResponse = {
                  itemName: anOrderItemInfo.itemName,
                  itemQuantity: anOrderItemInfo.itemQuantity,
                  itemTotalPrice: anOrderItemInfo.itemTotalPrice,
                }
                orderItemInfoResult.push(tempResponse);
              }
            }
          }
          // populate everything to the array in response
          finalResponseOrderDetails.push({
            restaurantId: req.query.restaurantId,
            restaurantEmailId: detailsResult.restaurantEmailId,
            buyerEmailId: detailsResult.buyerEmailId,
            buyerAddress: detailsResult.buyerAddress,
            orderItemsInfo: orderItemInfoResult,
            uniqueOrderId: detailsResult.uniqueOrderId,
            buyerName: detailsResult.buyerName,
          });
        }
      }
    }

    res.status(200).json({
      responseMessage: 'Found order information',
      orderDetails: finalResponseOrderDetails,
    })

  }

  try {
    getOrderDetails();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      responseMessage: "Failed to post new order in restaurant's table",
      uniqueOrderId: undefined,
    })
  }
});

router.post('/postOrder', function (req, res) {
  var postRestaurantOrderData = {
    restaurantEmailId: req.body.restaurantEmailId,
    restaurantId: req.body.restaurantId,
    buyerEmailId: req.body.buyerEmailId,
    buyerAddress: req.body.buyerAddress,
    buyerName: req.body.buyerName,
    restaurantOrderStatus: "New",
  }

  let uniqueOrderId = 0;

  const postNewOrder = async () => {
    var postNewOrderResult = await LoginSignUpDBObj.postNewRestaurantOrder("restaurantOrderTable", postRestaurantOrderData);
    if (postNewOrderResult && postNewOrderResult.insertId != 0) {
      uniqueOrderId = postNewOrderResult.insertId;
    } else {
      res.status(500).json({
        responseMessage: "Failed to post new order in restaurant's table",
        uniqueOrderId: undefined,
      })
    }

    var postBuyerOrderData = {
      uniqueOrderId: uniqueOrderId,
      buyerEmailId: req.body.buyerEmailId,
      buyerOrderStatus: "Upcoming",
    }

    var postNewBuyerOrderResult = await LoginSignUpDBObj.postNewBuyerOrder("buyerOrderTable", postBuyerOrderData);
    if (postNewBuyerOrderResult === undefined) {
      res.status(500).json({
        responseMessage: "Failed to post new order in buyer's table",
        uniqueOrderId: undefined,
      })
    }

    let totalOrderItemsData = {
      uniqueOrderId: uniqueOrderId,
      cartItems: req.body.cartItems,
    }
    var postOrderItemInfoResult = await LoginSignUpDBObj.addToOrderItemInfoTable("orderItemInfoTable", totalOrderItemsData);
    console.log('After inserting data to DB in orderiteminfotable');
    console.log(postOrderItemInfoResult);
    if (postOrderItemInfoResult === undefined || (postOrderItemInfoResult && postOrderItemInfoResult.insertId === undefined)) {
      res.status(500).json({
        responseMessage: "Failed to add order item details to orderItemInfoTable",
        uniqueOrderId: uniqueOrderId
      })
    }
  }

  try {
    postNewOrder();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      responseMessage: "Failed to post new order in restaurant's table",
      uniqueOrderId: undefined,
    })
  }
});


router.get('/getBuyerOrder', function (req, res) {
  getAllBuyerOrders = async () => {
    let buyerEmailId = req.query.buyerEmailId;
    let buyerId = req.query.buyerId;
    let finalResponse = [];
    console.log(req.query)
    console.log('Getting order information for buyer')
    var getBuyerOrderResult = await LoginSignUpDBObj.getBuyerOrderTable();
    // console.log(getBuyerOrderResult);
    if (getBuyerOrderResult === undefined) {
      res.status(500).json({
        responseMessage: "Unable to get information from buyer order table",
      })
    } else {
      for (let index = 0; index < getBuyerOrderResult.length; index++) {
        let anOrder = getBuyerOrderResult[index];
        let eachOrderInfo = {};
        console.log(req.query);
        console.log(anOrder);
        if (anOrder.buyerEmailId === buyerEmailId) {
          let uniqueOrderId = anOrder.uniqueOrderId;
          var orderItemsInfo = await LoginSignUpDBObj.getOrderItemsInfo("orderItemInfoTable");
          let filteredOrderItemsInfo = [];
          for (let itemsOrderIndex = 0; itemsOrderIndex < orderItemsInfo.length; itemsOrderIndex++) {
            if (uniqueOrderId === orderItemsInfo[itemsOrderIndex].uniqueOrderId) {
              filteredOrderItemsInfo.push(orderItemsInfo[itemsOrderIndex])
            }
          }
          console.log('get info from order items info table')
          console.log(filteredOrderItemsInfo);
          var restaurantOrderInfo = await LoginSignUpDBObj.getOrderDetailsById("restaurantOrderTable", uniqueOrderId);
          console.log('get info from rest. order table')
          console.log(restaurantOrderInfo);
          var restaurantDetails = await LoginSignUpDBObj.getRestaurantDetails("restaurantTable", restaurantOrderInfo[0].restaurantId);
          console.log('get info from rest table')
          console.log(restaurantDetails);
          if (filteredOrderItemsInfo !== undefined && filteredOrderItemsInfo.length > 0) {
            eachOrderInfo = {
              uniqueOrderId: uniqueOrderId,
              orderItemsInfo: filteredOrderItemsInfo,
              buyerOrderStatus: anOrder.buyerOrderStatus,
              buyerEmailId: anOrder.buyerEmailId,
              restaurantOrderStatus: restaurantOrderInfo[0].restaurantOrderStatus,
              restaurantName: restaurantDetails[0].restaurantName,
              restaurantAddress: restaurantDetails[0].restaurantAddress,
            }
          }
          finalResponse.push(eachOrderInfo);
        } else {
          continue;
        }
      }
      console.log('final response to client');
      console.log(finalResponse);
      res.status(200).json({
        responseMessage: "Found entries in buyer order table",
        allOrderData: finalResponse,
      })
    }
  }

  try {
    getAllBuyerOrders();
  } catch (err) {
    console.log(err);
  }
});


/*
  * Call this endpoint from Restaurant Owner, when restaurant Owner is managing status of order
  * From new --> preparing --> ready --> delivered.
  */
router.post('/updateOrder', function (req, res) {
  var updateData = {
    uniqueOrderId: req.body.uniqueOrderId,
    orderStatus: req.body.nextStatus,
  }
  const updateOrderQuery = async () => {
    var updateOrderQueryResult = await LoginSignUpDBObj.updateOrderByRestaurant("restaurantOrderTable", updateData);
    if (updateOrderQueryResult && updateOrderQueryResult.changedRows) {
      if (updateOrderQueryResult.changedRows != 0) {
        res.status(200).json({
          responseMessage: 'Order successfully updated!',
        });
      } else {
        res.status(500).json({
          responseMessage: 'Failed to update Order!',
        });
      }
    } else {
      res.status(500).json({
        responseMessage: 'Failed to update Order!'
      });
    }

    if (req.body.nextStatus === "Delivered") {
      updateBuyerOrderTableResult = await LoginSignUpDBObj.updateBuyerOrderTable("buyerOrderTable", req.body.uniqueOrderId, "Past");
      console.log(updateBuyerOrderTableResult);
      if (updateBuyerOrderTableResult && updateBuyerOrderTableResult.affectedRows != 1) {
        console.log("Entry not found in BuyerOrderTable");
      }
    }
  }

  try {
    updateOrderQuery();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Failed to place Order!' });
  }
});

module.exports = router;