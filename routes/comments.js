const express    = require('express');
const router     = express.Router({ mergeParams: true });
const Campground = require('../models/campground.js');
const Comment    = require('../models/comment.js');
const middlewares = require('../middlewares');
// ====================
// COMMENTS ROUTES
// ====================
router.get("/comments/new", middlewares.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/comments", middlewares.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username; 
               comment.save();
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

// EDIT - show edit form
router.get('/comments/:comment_id/edit', middlewares.checkCommentOwnership, function(req, res) {
  // find comment by ID 
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err || !foundCampground) {
      req.flash('error', "Campground for this comment is not found");
      return res.redirect('back');
    }
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        console.log(err);
        return res.redirect("back");
      }
      res.render("comments/edit", { comment: foundComment, campground_id: req.params.id});
    });
  });
  
});
// UPDATE - update comment
router.put('/comments/:comment_id', middlewares.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      console.log(err);
      return res.redirect("back");
    }
    res.redirect("/campgrounds/" + req.params.id);
  });
});
//DELETE - delete comment
router.delete('/comments/:comment_id', middlewares.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      console.log(err);
      return res.redirect('back');
    }
    res.redirect("back");
  });
});

module.exports = router;