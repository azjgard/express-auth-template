var userController = require('../../controllers/userController.js');

function setRoutes(router) {
  router.get('/signup', function(req, res) {
    // if the user is already logged in, redirect home
    if (req.session.user) {
      req.session.msg = 'You\'re already logged in!';
      res.redirect('/');
    } 
    // Otherwise, render the page
    else {
      res.render('user/signup', { sessionMessage : req.session.msg, });
    }
  });

  router.post('/signup', function(req, res) {
    if (req.session.user) {
      req.session.msg = "You cannot create a user, you're already logged in.";
      res.redirect('/');
    }
    else {
      userController.createUser(req, res);
    }
  });
}

module.exports = setRoutes;
