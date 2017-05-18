var crypto   = require('crypto');
var mongoose = require('mongoose'),
    User     = mongoose.model('User');

function hashPW(pwd) {
  return crypto.createHash('sha256').update(pwd)
    .digest('base64').toString();
}

function createUser(req, res) {
  var username = req.body.username,
      password = req.body.password,
      email    = req.body.email;

  // new User object to store in the database
  var user = new User({
    username        : username ,
    email           : email    ,
    hashed_password : hashPW(password)
  });

  user.save(function(err) {

    // if there was an error in creating the user, log the error,
    // and redirect to the signup page
    if (err) {
      console.log(err);
      res.session.error = err;
      res.redirect('/signup');
    } 

    // if the user was successfully created, save its information
    // in the session variable
    else {
      req.session.user     = user.id;
      req.session.username = user.username;
      req.session.msg      = 'Authenticated as ' + user.username;
      res.redirect('/');
    }
  });
}

function loginUser(req, res) {
  var username = req.body.username,
      password = req.body.password.toString();

  // Pull the User object from the database that matches
  // the username provided
  User.findOne({ username: username })

  // cb
  .exec(function(err, user) {
    // hash the submitted password
    var submittedPasswordHashed = hashPW(password);

    // if no user was found, set an appropriate error message
    if (!user) {
      err = 'No user was found with that username';
    } 

    // if a user was found and the hashed password
    // in the database matches the hashed version
    // of the password that the user submitted
    else if (user.hashed_password === submittedPasswordHashed) {
      // the session is generated, meaning all current session variables
      // are cleared and a new session ID is generated. In the callback,
      // store the information for the new user in the new session
      // that has been generated
      req.session.regenerate(function() {
        console.log('The user has been logged in: ', user);

        req.session.user     = user.id;
        req.session.username = user.username;
        req.session.msg      = 'You have authenticated as ' + user.username;

        // Redirect to homepage
        res.redirect('/');
      });
    }

    // otherise, if a user was found but the passwords did NOT match
    else {
      err = 'Login information is incorrect';
    }

    // if an error was set
    if (err) {
      // clear all session variables (through the regenerate function)
      req.session.regenerate(function() {
        req.session.msg = err; // set the error as the session message
        res.redirect('/login'); // redirect to the login
      });
    }
  });
}

function getUser(req, res) {
  // pull the user from the database whose
  // PK matches the user ID of the session
  //
  // NOTE: this means that this function
  // will only pull user information from
  // the database when THAT user is logged in
  User.findOne({ _id: req.session.user })

  // cb
  .exec(function(err, user) {

    // if no user was found
    if (!user){
      res.json(404, { err : 'User Not Found.' });
    } 

    // if a user was found, send the user as JSON
    else {
      res.json(user);
    }
  });
}

function updateUser(req, res) {
  var email    = req.body.email,
      password = req.body.password.toString();

  // pull the user from the database whose
  // PK matches the user ID of the session
  //
  // NOTE: this means that this function
  // will only pull user information from
  // the database when THAT user is logged in
  User.findOne({ _id: req.session.user })

  // cb
  .exec(function(err, user) {
    
    // if the request body has email attached to it,
    // update the email
    if (email) {
      user.set('email', email);
    }

    // if the request body has a password attached to it,
    // update the password
    if (password) {
      user.set('hashed_password', hashPW(password));
    }

    // save to the DB
    user.save(function(err) {
      if (err) {
        req.session.error = err;
      } 

      // if it was successful
      else {
        req.session.msg = 'Your profile has been updated';
      }
      
      // redirect to the user page
      res.redirect('/user');
    });
  });
}

function deleteUser(req, res) {

  // pull the user from the database whose
  // PK matches the user ID of the session
  //
  // NOTE: this means that this function
  // will only pull user information from
  // the database when THAT user is logged in
  User.findOne({ _id: req.session.user })

  // cb
  .exec(function(err, user) {

    // if a user was found
    if (user) {
      user.remove(function(err) {
        if (err) {
          req.session.msg = err;
        }
      });
    } 
    else {
      req.session.msg = 'That user was not found.';
    }
    // end the session and redirect to the login page,
    // logging the user out
    req.session.destroy(function() {
      res.redirect('/login');
    });
  });
}

function logoutUser(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
}

exports.createUser = createUser;
exports.loginUser  = loginUser;
exports.getUser    = getUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.logoutUser = logoutUser;
