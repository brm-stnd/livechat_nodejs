var express = require('express');
var router = express.Router();
var linkifyHtml = require('linkifyjs/html');
var linkifyStr = require('linkifyjs/string');

function socket(io) {
  // start listen with socket.io
  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('new message', function(msg){
      var options = {/* … */};
      var data = {
        nama: linkifyStr(msg.nama, options),
        message: linkifyStr(msg.message, options)
      }
      io.emit('chat message', data);
    });
  });
  /* GET home page. */
  router.get('/home', function(req, res, next) {
    res.render('index', { title: 'Express socket' });
  });
}
module.exports = {
  router: router,
  sck: socket
}
