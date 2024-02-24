const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message:{
        type:String,
        required: true,
        trim: true,
    },
    sender:{
        type:String,
    },
    receiver :{
        type:String,
    },
    time:{
        type: Date,
        default: Date.now()
    } 
})

module.exports = mongoose.model("Message", messageSchema);