var Payment = require('../models/payment');
var Patient = require('../models/patients');
module.exports = {
  isLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      req.flash('error', 'You must be signed in to do that!');
      res.redirect('/login');
  },
  checkAdminPatient: function(req, res, next){
    Patient.findById(req.params.id, function(err, foundPatient){
      if(err || !foundPatient){
          console.log(err);
          req.flash('error', 'Sorry, that patients does not exist!');
          res.redirect('/patientList');
      } else if(foundPatient.admin.id.equals(req.user._id) || req.user.isAdmin){
          req.patients = foundPatient;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/patientList/' + req.params.id);
      }
    });
  },
  checkAdminPayment: function(req, res, next){
    Payment.findById(req.params.paymentId, function(err, foundPayment){
       if(err || !foundPayment){
           console.log(err);
           req.flash('error', 'Sorry, that payment does not exist!');
           res.redirect('/patientList');
       } else if(foundPayment.author.id.equals(req.admin._id) || req.admin.isAdmin){
            req.payment = foundPayment;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/patientList/' + req.params.id);
       }
    });
  },
  isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'This site is now read only thanks to spam and trolls.');
      res.redirect('back');
    }
  },
  // isSafe: function(req, res, next) {
  //   if(req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
  //     next();
  //   }else {
  //     req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
  //     res.redirect('back');
  //   }
  // }
}