const mongoose = require('mongoose');
require('dotenv').config();

const connect = async() =>{
    mongoose.connect(process.env.MONGODB_URL, {
        
    })
    .then(()=>{
        console.log("DB Connection Successful");
    })
    .catch((error)=>{
        console.log("Error while connecting to DB: ", error);
    })
}

module.exports = connect; 