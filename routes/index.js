var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = {
      title: 'Livechat Nodejs'
    }
  res.render('index', data);
});

module.exports = router;
