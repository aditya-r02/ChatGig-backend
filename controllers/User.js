const mailSender = require("../Services/NodeMailer");
const Otp = require("../models/Otp");
const User = require("../models/User");
require('dotenv').config();
const jwt = require('jsonwebtoken')
const mongoose =require('mongoose')
 
//it will fetch friends
exports.findFriends = async(req, res) =>{
    const {token} = req.body;

    if (!token){
        return res.status(200).json({
            success: false,
            message:"Some Error Ocurred, try logging in again"
        })
    }

    const details = jwt.verify(token, process.env.JWT_SECRET).userDetails;
 
    const id = details._id;

    let userFriends = await User.findOne({_id:id});
    userFriends = userFriends.friends;

    //console.log(userFriends);

    if (!userFriends || userFriends.length==0){
        return res.status(200).json({
            success: true,
            message:"No friends",
            data: []
        })
    }
    let data = [];
    for (let i=0; i<userFriends.length; i++){
        const details = await User.findOne({_id:userFriends[i]});
        data.push(details);
    }

    return res.status(200).json({
        success: true,
        message: "Friends fetched successfully",
        data
    })
}

exports.fetchRequest = async(req, res) =>{
    try{
        const {token} = req.body;

        if (!token){
            return res.status(200).json({
                success: false,
                message:"Some Error Ocurred, try logging in again"
            })
        }
        
        //console.log(token);

        const details = jwt.verify(token, process.env.JWT_SECRET).userDetails;

        
    
        const id = details._id;

        const userDetails = await User.findOne({_id:id});
        //console.log(userDetails.requests)

        const requestDetails = userDetails.requests;

        //console.log(requestDetails)

        if (!requestDetails || requestDetails.length===0){
            return res.status(200).json({
                success: true,
                message:"No requests",
                data: []
            })
        }

        let data = [];

        for (let i=0; i<requestDetails.length; i++){
            //console.log(requestDetails[i]);
            const userDetails = await User.findOne({_id:requestDetails[i]});
            data.push(userDetails);
        }

        //console.log(data);

        return res.status(200).json({
            success: true,
            message: "Friend requests successfully fetched",
            data
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:"Some error occured"
        })
    }
}

exports.searchFriend = async(req, res) =>{
    try{
        const {userName, token} = req.body;

        if (!userName || !token){
            return res.status(200).json({
                success: false,
                message:"Enter complete details"
            })
        }

        const details = jwt.verify(token, process.env.JWT_SECRET).userDetails;

        //console.log(details);
        if (details.userName===userName){
            return res.status(200).json({
                success: false,
                message:"Why are you searching yourself"
            })
        }

        const searchDetails = await User.findOne({userName});

        if (!searchDetails){
            return res.status(200).json({
                success: false,
                message:"Invalid Username"
            })
        }

        searchDetails.password = null;

        return res.status(200).json({
            success: true,
            message:"User found!",
            data: searchDetails
        })



    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Some Error Occured!"
        })
    }
}

exports.sendRequest = async(req, res) =>{
    try{
        const {token, userName} = req.body;

        if (!token || !userName){
            return res.status(200).json({
                success: false,
                message:"Enter complete Details"
            })
        }

        const details = jwt.verify(token, process.env.JWT_SECRET).userDetails;

        //console.log(details)
 
        const id = details._id;

        const otherUser = await User.findOne({userName});

        //console.log(otherUser);
        
        if (!otherUser){
            return res.status(200).json({
                success: false,
                message:"User not found!"
            })
        }

        let requestList = otherUser.requests;
        requestList.push(id);
        //console.log(requestList)
        const updated = await User.findOneAndUpdate({userName}, {requests:requestList});

        return res.status(200).json({
            success: true,
            message:"Request sent!",
            updated
        })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:"Some Error"
        })
    }
}

exports.acceptRequest = async(req, res) =>{
    try{
        const {token, otherId} = req.body;

        if (!token || !otherId){
            return res.status(200).json({
                success: false,
                message:"Enter complete details"
            })
        }

        const userDetails = jwt.verify(token, process.env.JWT_SECRET).userDetails;

        const id = userDetails._id;

        const currUser = await User.findOne({_id:id});
        console.log(currUser)

        let requestList = currUser.requests;
        let friendsList  = currUser.friends;

        requestList = requestList.filter((id1)=> id1!=otherId);
        friendsList.push(otherId);
        console.log(friendsList)

        const updatedUserDetails = await User.findOneAndUpdate({_id:id}, {friends:friendsList, requests:requestList});
        console.log(updatedUserDetails)

        const otherUser = await User.findOne({_id:otherId});
        console.log(otherUser)

        const otherFriends = otherUser.friends;
        otherFriends.push(id);
        const updatedOtherDetails = await User.findOneAndUpdate({_id:otherId}, {friends:otherFriends});

        console.log(updatedOtherDetails);

        return res.status(200).json({
            success: true,
            message:"Accepted"
        })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error!"
        })
    }
}