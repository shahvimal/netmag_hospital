var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    Patients  = require("./models/patients"),
    Payments     = require("./models/payment"),
    Admin        = require("./models/admin"),
    session = require("express-session"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override");
    const fs =require('fs');
    const PDF = require('pdfkit');
    
var stripe = require("stripe")("pk_test_L3dTLgImbrkPPyrCSMvXMI1D");
//requiring routes
//var paymentRoutes    = require("./routes/payment"),
patientRoutes = require("./routes/patients"),
indexRoutes      = require("./routes/index");
    
// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;
const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/netmag';
mongoose.connect(databaseUri, { useMongoClient: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

//require moment
app.locals.moment = require('moment');
seedDB(); 
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    ///------Sign up------////
    next();
 });

app.use("/", indexRoutes); 
//app.use("/patientList",patientRoutes);




app.get("/patientList", function(req, res){
    if(req.query.search && req.xhr) {
         const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all patients from DB
        Patients.find({name: regex}, function(err, allPatients){
           if(err){
              console.log(err);
           } else {
              res.status(200).json(allPatients);
           }
        });
    } else {
        // Get all patients from DB
        Patients.find({}, function(err, allPatients){
           if(err){
               console.log(err);
           } else {
              if(req.xhr) {
                res.json(allPatients);
              } else {
                 patients=allPatients;
                res.render("patientList",{patients: patients});
              }
           }
        });
    }
  });


app.post("/addpatient", function(req, res){
    // get data from form and add to patients array
    var fname = req.body.fname;
    var lname = req.body.lname;
    var id = req.body.id;
    var name = fname+lname;
    var dname = req.body.dname;
    var illness = req.body.illness;
    var amount = 2000;
    // var admin = {
    //     id: req.admin._id,
    //     username: req.admin.username
    // }
    var appointment = req.body.appointment;
      var newPatient = {id:id,name: name, dname:dname,illness:illness, appointment:appointment};
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
      //------------for pdf----
        let doc =new PDF();
        doc.pipe(fs.createWriteStream(`pdf-files/${id}-${name}.pdf`));
        doc.text('------------------------------------------------------------------------------------------------',100);
        doc.text('NetMeg Hospital',240);
        doc.text('------------------------------------------------------------------------------------------------',100);
        doc.text(`ID: ${id}`,100);
        doc.text(`Name: ${name}`,100);
        // doc.text('_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ',100);
        doc.text(`\n\nDoctor Name: ${dname}`,100);
        doc.text('------------------------------------------------------------------------------------------------',100);
        doc.text(`\n\n\n\nIllness Name: ${illness}`,100);
        doc.text(`\nAppointment : ${appointment}`,100);
        doc.text(`\n\n\n\n------------------------------------------------------------------------------------------------ `,100);
        doc.text(`------------------------------------------------------------------------------------------------`,100);
        doc.text(`\nAmount : ${amount}`,100);
        doc.end();
        console.log("PDF Geenerated");


});
  
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


// app.get("/",(req,res)=>{
//     res.render("landing.ejs");
// });
 app.get("/dashboard",(req,res)=>{
     res.render("dashboard.ejs");
 });
// app.get("/login",(req,res)=>{
//     res.render("login.ejs");
// });
app.get("/addpatient",(req,res)=>{

    res.render("addpatient.ejs");
});
app.get("/billing",(req,res)=>{

    res.render("billing.ejs");
});

app.post("/billing",(req,res)=>{
  const token = req.body.stripeToken; 
  {
    const charge = stripe.charges.create({
      amount: 999,
      currency: 'usd',
      description: 'Example charge',
      source: token,
    });
  }
  res.render("checkout.ejs");
});






app.listen(5000,()=>{
    console.log("server started");
});
