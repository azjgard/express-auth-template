var express      = require('express');
var path         = require('path');
var favicon      = require('static-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var extend = require('extend');

// interface to interact with mongoDB
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/auth_test')
  .then(function(err) {
    if (err) {
      console.log('An error occured: ', err); 
    }
    else {
      console.log('Connected to Mongo!');
    }
  });

// save data in browser without allowing user access
var expressSession = require('express-session');

// interface to store sessions in mongoDB with the 
// rest of the data
var mongoStore = require('connect-mongo')(expressSession);

/* Models */
require('./models/userModel.js');

/* Routes */
var routes = require('./routes/routes');

var app = express();

// CUSTOM MIDDLEWARE:
// Pass window.location.pathname into all templates on a global scale
// as "path" variable
app.use(function(req, res, next) {
  var _render = res.render;
  var path    = req.path;

  res.render = function(view, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options  = {};
    }
    else if (!options) {
      options = {};
    }

    extend(options, {
      path: path
    });

    _render.call(this, view, options, callback);
  };

  next();
});

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


/* Session */

// NOTE: we could actually specify a session id
// within this object, but by default, it's automatically
// generated in a secure way using the "uid-safe" library
//
// NOTE: the secret can be anything arbitrary. it just makes
// it harder for anyone who steals a phished cookie to decrypt
// it because they'll have to guess the secret first.
app.use(expressSession({
  secret            : 'secret',
  cookie            : { maxAge : 2628000000 },
  resave            : true,
  saveUninitialized : true,
  store             : new mongoStore({
    mongooseConnection:mongoose.connection
  })
}));

app.use('/', routes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//////////////////////
//////////////////////
//////////////////////
module.exports = app;
