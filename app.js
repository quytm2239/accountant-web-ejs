var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejsLayouts = require("express-ejs-layouts");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// authenticated session
// https://github.com/expressjs/session
var session = require('express-session')

var redis = require('redis');
var redisStore = require('connect-redis')(session);
var redisClient = redis.createClient();

app.use(session({
    secret: 'node-mvc-demo',
    // cookie: { maxAge: 3000 },
    // create new redis store.
    store: new redisStore({
        host: 'localhost',
        port: 6379,
        client: redisClient,
        ttl :  180}),
    resave: false,
    saveUninitialized: false,
    rolling: true
}));

// get our predefined file
var show_clientip = require('./middleware/show_clientip')
var check_session = require('./middleware/check_session')
app.use(show_clientip)
app.set('check_session',check_session)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(ejsLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  //
  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  if (err.status == 404) {
    res.redirect('/404.html')
  }
  if (err.status == 500) {
    res.redirect('/500.html')
  }
});

module.exports = app;
