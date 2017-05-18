var crypto  = require('crypto');
var express = require('express');

var router = express.Router();

require('./index')(router);
require('./user/login')(router);
require('./user/logout')(router);
require('./user/signup')(router);

module.exports = router;

/*
 * Global Template Variables:
 *
 * path - contains the path of the URL
 */
