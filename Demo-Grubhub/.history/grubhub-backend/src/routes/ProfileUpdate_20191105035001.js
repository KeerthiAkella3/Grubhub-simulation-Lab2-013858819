//imports
const express = require('express');
const router = express.Router();
var fs = require('fs');
const multer = require('multer');
var passport = require('passport');
var kafka = require('../kafka/client');
const path = require('path');
//const img = require('./../../uploads/profilePictures')
//middleware
var requireAuth = passport.authenticate('jwt', { session: false });

//multer storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + './../../uploads/profilePictures');
  },
  filename: (req, file, callback) => {
    fileExtension = file.originalname.split('.')[1];
    console.log("fileExtension", fileExtension);
    callback(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + fileExtension);
  },
});

var upload = multer({ storage: storage });

router.get('/buyerDetails', function (req, res) {
  console.log("Inside get buyer profile");
  console.log("Request params:");
  console.log(req.query);

  kafka.make_request('loginSignuptopic',{"path":"buyerProfile","buyerId":req.query.buyerId, "body":req.query}, function(err,kafkaResult){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (kafkaResult.status === 200)

    {
      console.log("Results found");
      console.log("kafkaResult")
      console.log(kafkaResult)
      res.status(200).json({ 
        buyerDetails: kafkaResult.result,
       });  
    } else if (kafkaResult.status === 204){
      console.log("No results found");
      res.status(200).json({ responseMessage: 'No results found!' });
    }
  });
});

router.get('/restaurantDetails', function (req, res) {
  console.log('Inside restaurant get profile');
  console.log('request params:');
  console.log(req.query);

  kafka.make_request('loginSignuptopic',{"path":"restaurantProfile", "restaurantId": req.query.restaurantId}, function(err, kafkaResult) {
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (kafkaResult.status === 200)
    {
      console.log("Results found");
      res.status(200).json({ 
        restaurantDetails: kafkaResult.result,
       });  
    } else if (kafkaResult.status === 204){
      console.log("No results found");
      res.status(200).json({ responseMessage: 'No results found!' });
    }
  });
});

router.post('/updateBuyerProfile',  function (req, res) {
  console.log("Inside profile put request");
  console.log("Request Body:");
  console.log(req.body);
  kafka.make_request('loginSignuptopic',{"path":"updateBuyerProfile", "id": req.body.buyerId, "body":req.body}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Updated Profile");
      res.status(200).json({ responseMessage: 'Successfully Saved!' });
    } else if (result.status === 205){
      console.log("No results found to update");
      res.status(400).json({ responseMessage: 'No results found to update' });
    }
  });
});

router.post('/img/upload', upload.single('selectedFile'), function (req, res) {
  console.log("Inside post profile img");
  console.log("Request body:");
  console.log(req.body);
  console.log("filename", req.file.filename);
  let filename = req.file.filename;

  let pathKafka=''
  if(req.query.table === "buyerTable"){
    pathKafka = "uploadBuyerPicture"
  }
  else{
    pathKafka = "uploadRestaurantPicture"
  }

  kafka.make_request('loginSignuptopic',{"path":pathKafka, "body": req.body, "filename": filename}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Updated Profile");
      res.status(200).json({ responseMessage: 'Successfully Saved!' });
    } else if (result.status === 205){
      console.log("No results found to update");
      res.status(400).json({ responseMessage: 'No results found to update' });
    }
  });
});

router.get('/profile/img', function (req, res) {
  console.log("Inside get profile image");
  console.log("Request params:");
  console.log(req.query);

  let pathKafka = ""
  if(req.query.table === "buyerTable"){
    pathKafka = "getBuyerPicture"
  }
  else{
    pathKafka = "getRestaurantPicture"
  }

  kafka.make_request('loginSignuptopic',{"path":pathKafka,"body":req.query}, function(err,result){
    console.log("result in backend for image")
    console.log(result)
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      function base64_encode(file) {
        var bitmap = fs.readFileSync(file);
        return new Buffer(bitmap).toString('base64');
      }
      console.log("Results found");
      console.log(result.img);
      if(result.img != null){
      var filePath = path.join(__dirname + './../../uploads/profilePictures',result.img);
      console.log("file path:",filePath);
      var base64str = base64_encode(filePath);
      console.log("converted img to base64 and sent");
      res.status(200).json({ base64str: base64str });
      }
      else{
        res.status(204).json({ responseMessage: 'No image found!' });
      }
    } else if (result.status === 204){
      console.log("No results found");
      res.status(204).json({ responseMessage: 'No image found!' });
    }
  });

});

router.put('/remove/img', function (req, res) {
  console.log("Inside remove profile img");
  console.log("Request body:");
  console.log(req.body);
  if(req.query.table === "buyerTable"){
    path = "removeBuyerPicture"
  }
  else{
    path = "removeRestaurantPicture"
  }
  kafka.make_request('loginSignuptopic',{"path":path, "body": req.body}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Removed profile pic");
      res.status(200).json({ responseMessage: 'Successfully Removed!' });
    } else if (result.status === 205){
      console.log("No results found to update");
      res.status(400).json({ responseMessage: 'No results found to update' });
    }
});
});


module.exports = router;