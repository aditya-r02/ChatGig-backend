const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required: true,
        trim: true
    },
    lastName:{
        type:String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        required: true,
        trim: true
    },
    password:{
        type:String,
        required: true,
        trim: true
    },
    userName:{
        type:String,
        required: true,
        trim: true
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId
        }
    ],
    socketId:{
        type: String,
        trim: true,
    },
    requests:[
        {
            type:mongoose.Schema.Types.ObjectId
        }
    ]
})

module.exports = mongoose.model("User", userSchema);