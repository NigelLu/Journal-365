require('./db');
require('./auth');
require('dotenv').config();

const path = require('path');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require("cors");

const routes = require('./routes/index');

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// #region middleware

// enable CORS
app.use(cors({
  "origin": `${process.env.REACT_SERVER || 'http://localhost:3000'}`,
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": true,
  "optionsSuccessStatus": 204,
  "credentials": true,
}));

// enable parser

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable sessions
const sessionOptions = {
    secret: `${process.env.SECRET}`,
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));

// enable static file serve
app.use(express.static(path.join(__dirname, 'public')));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// make user data available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// #endregion

// #region route handler

app.use('/', routes);

// #endregion

module.exports = app;