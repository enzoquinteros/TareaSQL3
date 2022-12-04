var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');

require('dotenv').config();
var pool = require('./modules/bd');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var instrumentosRouter = require('./routes/instrumentos');
var historiaRouter = require('./routes/historia');
var nosotrosRouter = require('./routes/nosotros');
var visitanosRouter = require('./routes/visitanos');
var contactoRouter = require('./routes/contacto');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "pvbufmakjsofmkasomfk",
  resave: false,
  saveUninitialized: true
}));

app.get('/', function(req,res){
  var conocido = Boolean(req.session.nombree);

  res.render('index',{
    title: 'Sesiones en Express.js',
    conocido: conocido,
    nombree: req.session.nombree
  });

});

app.post('/ingresar',function(req,res){
  if(req.body.nombree){
    req.session.nombree = req.body.nombree
  }
  res.redirect('/');
});

app.get('/salir',function(req,res){
  req.session.destroy();
  res.redirect('/');
})


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/instrumentos', instrumentosRouter);
app.use('/historia', historiaRouter);
app.use('/nosotros', nosotrosRouter);
app.use('/visitanos', visitanosRouter);
app.use('/contacto', contactoRouter);

// var obj = {
//   nombre: 'Enzo',
//   apellido: 'Quinteros',
//   trabajo: 'Programador'
// }

// pool.query('insert into empleados set ?', [obj]).then(function(resultados){
//   console.log(resultados);
// });

//select
pool.query('select * from empleados').then(function(resultados){
  console.log(resultados);
});

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
