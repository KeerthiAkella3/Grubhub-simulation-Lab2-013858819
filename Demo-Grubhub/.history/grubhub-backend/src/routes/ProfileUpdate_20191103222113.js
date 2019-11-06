//imports
const express = require('express');
const router = express.Router();
var fs = require('fs');
const multer = require('multer');
var passport = require('passport');
var kafka = require('../kafka/client');
const path = require('path');
//middleware
var requireAuth = passport.authenticate('jwt', { session: true });

//multer storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, '../uploads/profilePictures');
  },
  filename: (req, file, callback) => {
    fileExtension = file.originalname.split('.')[1];
    console.log("fileExtension", fileExtension);
    callback(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + fileExtension);
  },
});

var upload = multer({ storage: storage });

router.get('/buyerDetails', function (req, res) {
  console.log("Inside get profile");
  console.log("Request params:");
  console.log(req.query);

  kafka.make_request('profileTopics',{"path":"buyerProfile","body":req.query}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Results found");
      res.status(200).json({ profile: result.profile });
    } else if (result.status === 204){
      console.log("No results found");
      res.status(200).json({ responseMessage: 'No results found!' });
    }
  });

});

router.get('/restaurantDetails', function (req, res) {
  console.log('Inside restaurant get profile');
  console.log('request params:');
  console.log(req.query);

  kafka.make_request('loginSignuptopic',{"path":"restaurantProfile", "restaurantId": req.query.restaurantId}, function(err,result) {
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Results found");
      res.status(200).json({ 
        restaurantDetails: result;
       });
    } else if (result.status === 204){
      console.log("No results found");
      res.status(200).json({ responseMessage: 'No results found!' });
    }
  });
});

router.post('/updateBuyerProfile',  function (req, res) {
  console.log("Inside profile put request");
  console.log("Request Body:");
  console.log(req.body);
  kafka.make_request('profileTopics',{"path":"updateBuyerProfile", "body": req.body}, function(err,result){
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
  kafka.make_request('profileTopics',{"path":"upload_profile_pic", "body": req.body, "filename": filename}, function(err,result){
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

  kafka.make_request('profileTopics',{"path":"get_profile_img","body":req.query}, function(err,result){
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
      var filePath = path.join(__dirname + '../../../uploads/profilePictures',result.img);
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
  kafka.make_request('profileTopics',{"path":"remove_profile_img", "body": req.body}, function(err,result){
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