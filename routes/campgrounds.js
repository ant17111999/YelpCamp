const express    = require('express');
const router     = express.Router();  
const Campground = require('../models/campground.js');  
const middlewares = require('../middlewares');
        
//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middlewares.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middlewares.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash('error', "Campground not found");
            res.redirect('/campgrounds');
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT - show the edit form 
router.get('/:id/edit', middlewares.checkCampgroundOwnership, function(req, res) {
  // find the campground with given ID 
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      return console.log(err);
    }
    // render the edit template with that campground
    res.render('campgrounds/edit', {campground: foundCampground});
  });
});

// UPDATE - update campground
router.put('/:id', middlewares.checkCampgroundOwnership, function(req, res) {
  // find the campground with given ID and update
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if (err) {
      return console.log(err);
    }
    res.redirect('/campgrounds/' + req.params.id);
  });
});
// DELETE - delete campground
router.delete('/:id', middlewares.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      return console.log(err);  
    }
    res.redirect('/campgrounds');
  });
});

module.exports = router;