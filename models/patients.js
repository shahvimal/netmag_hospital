var mongoose = require("mongoose");

var PatientSchema = new mongoose.Schema({
   name: String,
   dname: String,
   id: String,
   illness: String,
   appointment:String,

   createdAt: { type: Date, default: Date.now },
   admin: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Admin"
      },
      username: String
   },
   payments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Payment"
      }
   ]
});

module.exports = mongoose.model("Patients", PatientSchema);