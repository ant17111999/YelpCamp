const express = require('express');
const router  = express.Router();
const passport = require('passport');
const User = require('../models/user.js');

router.get("/", function(req, res){
    res.render("landing");
});

// AUTH ROUTES

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  User.register({ username: req.body.username}, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      req.flash('error', err.message);
      return res.render('/register');
    }
    passport.authenticate("local")(req, res, function() {
      req.flash('success', "You have registered");
      res.redirect('/campgrounds');
    });
  });
});

// LOGIN ROUTES

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  function(req, res) {
  }); 

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', "Logged you out");
  res.redirect('campgrounds');
});

module.exports = router;