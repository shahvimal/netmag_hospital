var mongoose = require("mongoose");
var Patients = require("./models/patients");
var Payment   = require("./models/payment");

var data = [
    {
        name: "Cloud's Rest", 
        dname: "Desert Mesa",
        id: 1,
        illness: "String",
        appointment:"24/1/19 time -11.30",
       
    },
    {
        name: "Cloud's Rest", 
        dname: "Desert Mesa",
        id: 1,
        illness: "String",
        appointment:"24/1/19 time -11.30",
    },
    {
        name: "Cloud's Rest", 
        dname: "Desert Mesa",
        id: 1,
        illness: "String",
        appointment:"24/1/19 time -11.30",
    }
]

function seedDB(){
   //Remove all patients
   Patients.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed patients!");
         //add a few patients
        data.forEach(function(seed){
            Patients.create(seed, function(err, patient){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a patient");
                    console.log(seed.name);
                    //create a payment
                    Payment.create(
                        {
                            amount: "This place is great, but I",
                            admin: "Homer"
                        }, function(err, payment){
                            if(err){
                                console.log(err);
                            } else {
                                patient.payments.push(payment);
                                patient.save();
                                console.log("Created new payment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few payments
}

module.exports = seedDB;
