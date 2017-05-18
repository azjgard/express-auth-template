var userController = require('../../controllers/userController.js');

function setRoutes(router) {
  router.get('/logout', function(req, res) {
    if (req.session.user) {
      userController.logoutUser(req, res);
    }
    else {
      res.redirect('/login');
    }
  });
}

module.exports = setRoutes;
