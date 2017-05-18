var userController = require('../../controllers/userController.js');

function setRoutes(router) {
  router.get('/login', function(req, res) {
    res.render('user/login', { title: 'Login' });
  });

  router.post('/login', function(req, res) {
    userController.loginUser(req, res);
  });
}

module.exports = setRoutes;
