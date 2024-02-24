const mailSender = require("../Services/NodeMailer");
const Otp = require("../models/Otp");
const User = require("../models/User");
require('dotenv').config();
const jwt = require('jsonwebtoken')
const mongoose =require('mongoose')
const Message = require('../models/Message'); 
 
exports.fetchChat = async(req, res) =>{
    try{
        const {token, userName} = req.body;

        if (!token || !userName){
            return res.status(200).json({
                success: false,
                 message: "Invalid token, try login"
            })
        }

        const userDetails = jwt.verify(token, process.env.JWT_SECRET).userDetails;
        //console.log(userDetails);

        //const otherDetails = await User.findOne({userName});
        //console.log(otherDetails);

        const sent = await Message.find({sender:userDetails.userName, receiver:userName});
        //console.log("hi")
        const received = await Message.find({sender:userName, receiver:userDetails.userName});
        //console.log("hi")
 
        let messages = [...sent, ...received];
        messages  = messages.sort((a, b)=>a.time-b.time);

        // for (let i=0; i<messages.length; i++){
        //     console.log(messages[i].message+" "+messages[i].time);
        // }
        //console.log("hi")

        return res.status(200).json({
            success: true,
            message:"Message fetched successfully",
            data: messages
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Some Error"
        })
    }
}

exports.sendMessage = async(req, res) =>{
    
    try{
        const {token, userName, message} = req.body;

        const userDetails = jwt.verify(token, process.env.JWT_SECRET).userDetails;
        //console.log(userDetails);

        //const otherDetails = await User.findOne({userName});
        // console.log(otherDetails);

        const time = Date.now();
        //console.log(time);

        const msg = await Message.create({sender:userDetails.userName, receiver:userName,
        message, time});
        //console.log(msg);

        return res.status(200).json({
            success: true,
            message: "Message sent successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:"Some Error"
        })
    }
}