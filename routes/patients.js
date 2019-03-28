var express = require("express");
var router  = express.Router();
var Patients= require("../models/patients");
var Payment = require("../models/payment");
var middleware = require("../middleware");

//var { isLoggedIn, checkUserCampground, checkUserComment, isAdmin, isSafe } = middleware; // destructuring assignment


// //INDEX - show all patients
// router.get("/patientList", function(req, res){
//   if(req.query.search && req.xhr) {
//        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//       // Get all patients from DB
//       Patients.find({name: regex}, function(err, allPatients){
//          if(err){
//             console.log(err);
//          } else {
//             res.status(200).json(allPatients);
//          }
//       });
//   } else {
//       // Get all patients from DB
//       Patients.find({}, function(err, allPatients){
//          if(err){
//              console.log(err);
//          } else {
//             if(req.xhr) {
//               res.json(allPatients);
//             } else {
//                console.log(allPatients);
//                patients=allPatients;
//               res.render("/",{patients: patients});
//             }
//          }
//       });
//   }
// });


//CREATE - add new campground to DB
router.post("/addpatient", function(req, res){
   // get data from form and add to patients array
   var fname = req.body.fname;
   var lname = req.body.lname;
   var name = fname+lname;
   var dname = req.body.dname;
   var illness = req.body.illness;
   var admin = {
       id: req.admin._id,
       username: req.admin.username
   }
   var appointment = req.body.appointment;
     var newPatient = {name: name, dname:dname,illness:illness, admin:admin, appointment:appointment};
     // Create a new campground and save to DB
     Patients.create(newPatient, function(err, newlyCreated){
         if(err){
             console.log(err);
         } else {
             //redirect back to patients page
             console.log(newlyCreated);
             res.redirect("/patientList");
         }
     });
   });
 
module.exports = router;

