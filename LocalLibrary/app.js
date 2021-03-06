var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog'); // Import routes from catalog area of site

var compression = require('compression');
var helmet = require('helmet');

var app = express();

// Compress all routes, heavy traffic prefer reverse proxy like Nginx
app.use(compression());
// Protect against well known web vulnerabilities
app.use(helmet());

// Setting up mongoos connection
var mongoose = require('mongoose');


var dev_db_url = 'mongodb+srv://LocalLibrary2k19:dcba4321@cluster0-zicep.mongodb.net/local_library?retryWrites=true';
// uses process.env.MONGODB_URI to get the 
// connection string from an environment variable named MONGODB_URI if has been set
var mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter); // Add catalog routes to middleware chain

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
