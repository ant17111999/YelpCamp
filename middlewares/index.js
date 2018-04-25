const Comment = require('../models/comment.js');
const Campground = require('../models/campground.js');



var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', "You have to log in first");
  res.redirect('/login');
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err || !foundComment) {
      req.flash('error', "Comment does not exist");
      return res.redirect('back');
    }  
    if (!req.user || !foundComment.author.id.equals(req.user._id)) {
      req.flash('error', "You don't have permission to do that");
      res.redirect('back');
    } else {
      next();
    }
  });
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  // find campground with given ID
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err || !foundCampground) {
      req.flash('error', "Campground does not exist");
      return res.redirect('/campgrounds');
    }
    // check if the user matches the author of the campground
    if (!req.user || !foundCampground.author.id.equals(req.user._id)) {
      req.flash('error', "You don't have permission to do that");
      res.redirect('back');
    } else {
      next();
    }
  });
};


module.exports = middlewareObj;