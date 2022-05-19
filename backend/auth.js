const mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
