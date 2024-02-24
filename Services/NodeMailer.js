const nodemailer = require("nodemailer");
require('dotenv').config();

const mailSender = async(email, title, body) => {
    try{
        //console.log("Mailid: ", process.env.MAIL_USER, " ", process.env.MAIL_PASS);
        const transporter = nodemailer.createTransport({
            // name:"example.com",
            host: `${process.env.MAIL_HOST}`,
            auth: {
              user: `${process.env.MAIL_USER}`,
              pass: `${process.env.MAIL_PASS}`
            }
          });

          const info = await transporter.sendMail({
            from: `${process.env.MAIL_USER}`, // sender address
            to: `${email}`, // list of receivers
            subject: `${title}`, // Subject line
            html: `${body}`, // html body
          });

          //console.log(info);

          return info;

        
    }catch(error){
        console.log("Error while sending mail: ", error);
    }
}

module.exports = mailSender;