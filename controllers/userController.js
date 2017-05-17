var crypto   = require('crypto');
var mongoose = require('mongoose'),
    User     = mongoose.model('User');

function createUser(req, res) {

  var user = new User({
    username: req.body.username
  });

  user.set('hashed_password', hashPW(req.body.password));
  user.set('email', req.body.email);

  user.save(function(err) {
    console.log("In createUser.");

    // if there was an error in creating the user
    if (err) {
      console.log(err);
      res.session.error = err;
      res.redirect('/signup');
    } 

    // if the user was successfully created
    else {
      req.session.user     = user.id;
      req.session.username = user.username;
      req.session.msg      = 'Authenticated as ' + user.username;
      res.redirect('/');
    }
  });
}
