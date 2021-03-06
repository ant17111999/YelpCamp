const express       = require("express");
const app           = express();
const bodyParser    = require("body-parser");
const flash         = require('connect-flash');
const mongoose      = require("mongoose");
const methodOverride = require('method-override');
const passport      = require('passport');
const LocalStrategy = require('passport-local');
const Campground    = require("./models/campground");
const Comment       = require("./models/comment");
const User          = require('./models/user');
const seedDB        = require("./seeds");

// Require express routers
const campgroundsRoutes = require('./routes/campgrounds.js');
const commentsRoutes    = require('./routes/comments.js');
const indexRoutes       = require('./routes/index.js');

// Environment Variables
const PORT = process.env.PORT || 3000;
const IP   = process.env.IP;
const DATABASEURL = process.env.DATABASEURL;
    
//mongoose.connect("mongodb://localhost/yelp_camp_v4");
mongoose.connect(DATABASEURL);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash());
//seedDB();// seed the website

// PASSPORT CONFIG
app.use(require('express-session')({
  secret: 'another one', 
  resave: false, 
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id', commentsRoutes);

app.listen(PORT, IP, function(){
   console.log("The YelpCamp Server Has Started!");
});