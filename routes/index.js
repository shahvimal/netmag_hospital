var express = require("express");
var router  = express.Router();
var passport = require("passport");
var Admin = require("../models/admin");

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newAdmin = new Admin({username: req.body.username});
    if(req.body.adminCode === process.env.ADMIN_CODE) {
      newUser.isAdmin = true;
    }
    Admin.register(newAdmin, req.body.password, function(err, admin){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.adminname);
           res.redirect("/dashboard"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/login",
        failureRedirect: "/dashboard",
        failureFlash: true,
        successFlash: 'Welcome to Netmag Hospital!'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you later!");
   res.redirect("/dashboard");
});


module.exports = router;