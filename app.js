var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
const mongoose = require("mongoose");
var env = require('dotenv').config();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var socket = require('./routes/socket');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.io = require('socket.io')();

var database_host = '';
if (process.env.DB_TYPE === 'LOCAL') {
  database_host = process.env.DB_HOST_LOCAL;
} else if (process.env.DB_TYPE === 'DEVELOP') {
  database_host = process.env.DB_HOST_DEVELOP;
}

mongoose.set('useCreateIndex', true);
mongoose.connect(database_host, { useNewUrlParser: true, useFindAndModify: false });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'KeyAdalahKunci',saveUninitialized: true,resave: true}))

app.use('/', routes);
app.use('/users', users);
app.use('/socket', socket.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
socket.sck(app.io);

module.exports = app;
