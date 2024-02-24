const express = require('express');
const { signUp, login, sendOtp, checkUserName } = require('../controllers/Auth');
const { findFriends, searchFriend, fetchRequest, sendRequest, acceptRequest } = require('../controllers/User');
const { fetchChat, sendMessage } = require('../controllers/Chat');
const router = express.Router();

// Auth routes
router.post("/signup", signUp);
router.post("/login", login)
router.post("/getotp", sendOtp);
router.post("/checkusername", checkUserName);

//User routes
router.post("/friends", findFriends);
router.post("/searchuser", searchFriend);
router.post("/fetchrequests", fetchRequest);
router.post("/sendrequest", sendRequest);
router.post("/acceptrequest", acceptRequest);

// char routes
router.post("/fetchchat", fetchChat);
router.post("/sendmessage", sendMessage)

module.exports = router;