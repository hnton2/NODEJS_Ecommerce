var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const validator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const moment = require('moment');
const fs = require('fs');
const passport = require('passport');

const pathConfig = require('./path');
const { networkInterfaces } = require('os');


// Define Path
global.__base               = __dirname + '/';
global.__path_app           = __base + pathConfig.folder_app + '/';
global.__path_configs       = __path_app + pathConfig.folder_configs + '/';
global.__path_helpers       = __path_app + pathConfig.folder_helpers + '/';
global.__path_routers       = __path_app + pathConfig.folder_routers + '/';
global.__path_schemas       = __path_app + pathConfig.folder_schemas + '/';
global.__path_validates     = __path_app + pathConfig.folder_validates + '/';
global.__path_views         = __path_app + pathConfig.folder_views + '/';
global.__path_middleware       = __path_app + pathConfig.folder_middleware + '/';

global.__path_views_admin   = __path_views + pathConfig.folder_views_admin + '/';
global.__path_views_blog    = __path_views + pathConfig.folder_views_blog + '/';
global.__path_models        = __path_app + pathConfig.folder_models + '/';
global.__path_public        = __base + pathConfig.folder_public + '/';
global.__path_uploads       = __path_public + pathConfig.folder_uploads + '/';

const systemConfig = require(__path_configs + 'system');
const databaseConfig = require(__path_configs + 'database');
require(__path_configs + 'passport')(passport);

mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster01.em0e0.mongodb.net/${databaseConfig.database}?retryWrites=false&w=majority`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected");
});

var app = express();
app.use(cookieParser());
app.use(session({
  secret: 'abcnhds',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 10*60*1000
  }
}
));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.message = req.flash();
  next();
}); 
app.use(validator({
  customValidators: {
    isNotEqual: (value1, value2) => {
      return value1!==value2;
    }
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', __path_views_admin + 'admin');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Local variable
app.locals.systemConfig = systemConfig;
app.locals.moment = moment;
app.locals.fs = fs;

// Setup router
app.use(`/${systemConfig.prefixAdmin}`, require(__path_routers + 'backend/index'));
app.use('/', require(__path_routers + 'frontend/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(async(err, req, res, next) => {
  const GroupsModel 		= require(__path_models + 'groups');
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if(req.isAuthenticated()) {
    // render the error page
    await GroupsModel.getItems({id: req.user._doc.group.id}, {task: 'get-items-by-id'}).then((item) => {
      if(item.group_acp === 'yes') {
        res.status(err.status || 500);
        res.render(__path_views_admin +  'pages/error', { pageTitle   : 'Page Not Found ' });
      }
    });
  } else {
    res.status(err.status || 500);
    res.render(__path_views_blog +  'pages/error', {
      pageTitle   : 'Page Not Found ',
      top_post: false,
      layout_rss: false,
      layout_contact: false,
      layout_article: false,
      layout: __path_views_blog + 'frontend',
    });
  }
});

module.exports = app;

