const express = require('express');
const morgan = require('morgan');
const path = require('path');

//initializations
const app =express();

//settings
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set ('view engine','ejs');

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Rutes
app.use(require('./routes'));

//Public
app.use(express.static(path.join(__dirname,'public')));

//Starting the server
app.listen(app.get('port'),()=>{
  console.log('server on port', app.get('port'));
});