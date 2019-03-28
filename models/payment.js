var mongoose = require("mongoose");

var paymentSchema = mongoose.Schema({
    amount: String,
    createdAt: { type: Date, default: Date.now },
    admin: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin"
        },
        username: String
    }
});

module.exports = mongoose.model("Payment", paymentSchema);