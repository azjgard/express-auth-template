var userController = require('../controllers/userController.js');

function setRoutes(router) {
  router.get('/', function(req, res){
    // if the user is legitimate, render the index
    if (req.session.user) {
      res.render('index', {
        username       : req.session.username,
        sessionMessage : req.session.msg,
      });
    } 
    // Otherwise, redirect them to the login screen
    else {
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
  });
}

module.exports = setRoutes;
