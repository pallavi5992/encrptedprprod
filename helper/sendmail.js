
require("dotenv").config();

const nodemailer = require('nodemailer')

const sendEmail = async(email,subject, html )=>{

    const transporter =nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    })

    const emailOptions={
        from:  process.env.EMAIL_USER,
        to:email,
        subject:subject,
        text: html
    }
    await transporter.sendMail(emailOptions).then((data)=>{}).catch((e)=>{console.log(e.message);})
}

module.exports =  {
    sendEmail
}