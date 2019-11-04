const express = require('express');
const app = express();
const port = 3001;

var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');

const path = require('path');

// Log requests to console
var morgan = require('morgan');

//passport auth require
var config = require('./config/settings');
var passport = require('passport');

console.log("Initializing passport");
app.use(passport.initialize());

// Bring in defined Passport Strategy
require('./Config/passport').passport;
var config = require('./config/settings');
var mongoose = require('mongoose');
//var connStr = config.database_type + '://' + config.database_username + ':' + config.database_password + '@' + config.database_host + ':' + config.database_port + '/' + config.database_name;
var connStr = config.connection_string;
console.log(connStr);

mongoose.connect(connStr, { useNewUrlParser: true,useUnifiedTopology: true, poolSize: 10, }, function(err) {
  if (err) throw err;
  else {
      //const collection = client.db("grubhub");
      console.log('Successfully connected to MongoDB');
  }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

var loginSignup = require('./src/routes/loginSignup.js')
var menuItem = require('./src/routes/menuItemManage.js')
var profilePage = require('./src/routes/ProfileUpdate.js');
var orderManage = require('./src/routes/orderManage.js');

app.use('/uploads', express.static(path.join(__dirname, '/uploads/')));

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(session({
    secret: 'cmpe273_kafka',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

// Log requests to console
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
    extended: true
}));

 app.use(bodyParser.json());
 app.use('/', loginSignup);
 app.use('/', menuItem);
 app.use('/', profilePage);
 app.use('/', orderManage);