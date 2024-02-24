const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    otp:{
        type:String,
        trim: true,
    },
    email:{
        type:String,
        trim: true,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model("Otp", OtpSchema);