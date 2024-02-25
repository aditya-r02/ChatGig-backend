const mailSender = require("../Services/NodeMailer");
const Otp = require("../models/Otp");
const User = require("../models/User");
require('dotenv').config();
const jwt = require('jsonwebtoken')

 
const createOtp = () =>{
    let ans = "";
    for (let i=0; i<6; i++){
        let val = Math.floor(Math.random()*10);
        ans += new String(val);
    }

    return ans;
}

exports.checkUserName = async(req, res) =>{
    try{
        const {userName} = req.body;
        //console.log(userName);
        const prevUser = await User.findOne({userName});

        if (prevUser){
            return res.status(200).json({
                success: false,
                message: "Try a different user name"
            })
        }

        return res.status(200).json({
            success: true,
            message:"User Name Available",
            
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:"Some error occured"
        })
    }
}

exports.sendOtp = async(req, res) =>{
    try{
        const {firstName, lastName, email, password, userName} = req.body;

        if (!firstName || !lastName || !email || !password || !userName){
            return res.status(200).json({
                success: false,
                message:"Enter complete details"
            })
        }

        const prevUser = await User.findOne({email});
        if (prevUser){
            return res.status(200).json({
                success: false,
                message:"User already exists"
            })
        }

        const otp = createOtp();

        const otpDetails = await Otp.create({otp, email});

        await mailSender(email, "Otp verification", otp);

        //console.log(otpDetails);

        return res.status(200).json({
            success: true,
            message: "Otp sent successfully",
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Some error occured",
            success: false,
        })
    }
}

exports.signUp = async(req, res) =>{
    try{
        const {firstName, lastName, email, password, userName, otp} = req.body;
        
        const lastOtp = await Otp.find({email}).sort({createdAt:-1}).limit(1);

        if (!lastOtp || lastOtp.length===0){
            return res.status(200).json({
                success: false,
                message:"Otp not found, try resending otp"
            })
        }
        //console.log("hello1");

        if (otp!=lastOtp[0].otp){
            return res.status(200).json({
                success: false,
                message:"Incorrect otp"
            })
        }

        const newUser = await User.create({firstName, lastName, email, password, userName});

        //console.log(newUser);

        return res.status(200).json({
            success: true,
            message:"User created successfuly"
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"SOme erorr occured"
        })
    }
}

exports.login = async(req, res) =>{
    try{
        const {email, password} = req.body;

        if (!email || !password){
            return res.status(200).json({
                success: false,
                message:"Enter complete details"
            })
        }

        const userDetails = await User.findOne({email});

        if (!userDetails){
            return res.status(200).json({
                success: false,
                message:"User does not exists"
            })
        }

        if (userDetails.password!==password){
            return res.status(200).json({
                success: false,
                message:"Wrong password"
            })
        }


        userDetails.password = null;
        //console.log("hello");
        const token = jwt.sign({userDetails}, process.env.JWT_SECRET);

        res.cookie("token", token, { HttpOnly: true});
        return res.status(200).json({
            success: true,
            message:"Login successful",
            token: token,
            userName:userDetails.userName,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"Some error occured"
        })
    }
}
