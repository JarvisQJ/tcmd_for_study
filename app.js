var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieParser=require('cookie-parser');
var session=require('express-session');

var app = express();
//配置SESSION
app.use(cookieParser());
app.use(session({
  secret:"tcmd",
  resave: false,//每次请求重写有效期
  saveUninitialized: false,//未初始化也保存
  //持久化存储(数据库)
  // store: new MongoStore({
  //   url: "mongodb://" + dbUser + ":" + dbPwd + "@" + dbHost + ":" + dbPort + "/" + dbName
  //   //ttl: 2 * 60 * 60 // 默认14天(针对会话级别session,设置时间内无操作则自动失效)
  // })
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//顺序很重要
app.use('/login', require('./routes/login'));

app.use('/user', require('./routes/user'));
app.use('/treatment', require('./routes/treatment'));
app.use('/tcmt_syndrome', require('./routes/tcmt_syndrome'));
app.use('/tcmt', require('./routes/tcmt'));
app.use('/syndrome', require('./routes/syndrome'));
app.use('/symptom', require('./routes/symptom'));
app.use('/record', require('./routes/record'));
app.use('/prescription', require('./routes/prescription'));
app.use('/disease_tcmt', require('./routes/disease_tcmt'));
app.use('/disease_symptom', require('./routes/disease_symptom'));
app.use('/disease', require('./routes/disease'));
app.use('/assortment', require('./routes/assortment'));
app.use('/type', require('./routes/type'));
app.use('/frequency', require('./routes/frequency'));

app.use('/', require('./routes/middleware'));//中间件
app.use('/', require('./routes/routing'));


// catch 404 and forward to error handler
// app.use(function () {
//
// })


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

