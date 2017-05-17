var express      = require('express');
var path         = require('path');
var favicon      = require('static-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

// save data in browser without allowing user access
var expressSession = require('express-session');

// interface to store connections in mongoDB
var mongoStore = require('connect-mongo')({
  session: expressSession
});

// interface to interact with mongoDB
var mongoose = require('mongoose');

/* Models */
require('./models/userModel.js');

/* Routes */
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());

// the 'extended' option allows the parameters passed
// to the body to be of any datatype, instead of 
// exclusively strings and arrays
app.use(bodyParser.urlencoded({ extended : true }));

app.use(cookieParser());

// set the public directory as '/' to client code
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

module.exports = app;
