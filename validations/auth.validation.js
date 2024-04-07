 db = require("../models");
const User = db.user;
const { default: isEmail } = require("validator/lib/isEmail");
const bcrypt = require("bcryptjs");
const { Base64toId, idIntoBase64 } = require("../helper/idIntoBase64");
const { LocalStorage } = require('node-localstorage');
// const a=require("../../uploads")
const localStorage = new LocalStorage("../../uploads/scratch");


const login = async (req, res,next) => {
  try {
    const { emailId, password,captcha } = req.body;
    const captchImage = JSON.parse(localStorage.getItem('captcha'));
    if(!captchImage){
      return res
      .status(400)
      .send({ status: false, message: "Please enter valid Captcha!" });
    }

    const validateCaptch = await bcrypt.compare(
      req.body.captcha,
      captchImage?.hash,

    );
 if (!validateCaptch) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid Captcha!" });
    }
    if (!emailId) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter email address!" });
    } else if (!isEmail(emailId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid Email address!" });
    } else if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter password!" });
    }
    const isUserExist = await User.findOne({
      where: {
        Email_Id: emailId,
      },
    });
    if(!isUserExist){
        return res
        .status(400)
        .send({ status: false, message: "Invalid credentials!" });
    };


const actualPassword= await Base64toId(password) 
console.log("sdfasdfasd",actualPassword);
if(actualPassword.length==0){
  return res
  .status(400)
  .send({ status: false, message: "Invalid Password" });
}
  const isPassword =await bcrypt.compare(actualPassword,isUserExist?.Password);
  console.log("sdfasdfasd",isPassword);

    if(!isPassword){
        return res
        .status(400)
        .send({ status: false, message: "Invalid Password "});
    }
    if (!captcha) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter captcha!" });
    }


    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const forgotPassword = async (req, res,next) => {
try {
  const {emailId,captcha} = req.body
  const captchImage = JSON.parse(localStorage.getItem('captcha'));
  if(!captchImage){
    return res
    .status(400)
    .send({ status: false, message: "Please enter valid Captcha!" });
  }

  const validateCaptch = await bcrypt.compare(
    req.body.captcha,
    captchImage?.hash,

  );
if (!validateCaptch) {
    return res
      .status(400)
      .send({ status: false, message: "Please enter valid Captcha!" });
  }
  if (!emailId) {
    return res
      .status(400)
      .send({ status: false, message: "Please enter email address!" });
  }
  if (!captcha) {
    return res
      .status(400)
      .send({ status: false, message: "Please enter captcha!" });
  }
  next();
} catch (error) {
  
}
};
const resetPasswordRequest = async (req, res,next) => {
  try {
  
  } catch (error) {
    
  }
};
const changePassword=async(req,res,next)=>{
  const userId=req.params.userId;
  const{Password,confirmPassword,captcha}=req.body
  if(!userId){
    return res
    .status(400)
    .send({ status: false, message: "Enter UserId!" });
  }
  const actualUserId= await Base64toId(userId);
  if(actualUserId.length==0){
    return res
    .status(400)
    .send({ status: false, message: "Enter UserId!" });
  }
  
  const user=await User.findOne({
    where:{
      userId:parseInt(actualUserId)
    }
  });
  if(!user){
    return res
    .status(400)
    .send({ status: false, message: "Invalid user!" });
  }
  
  else if(user.firstLogin=="1"){
    return res
    .status(400)
    .send({ status: false, message: "You Aleardy changed the Password!" });
  }
  
  if(!Password){
    return res
    .status(400)
    .send({ status: false, message: "Enter Password!" });
  }
  else if(!confirmPassword){
    return res
    .status(400)
    .send({ status: false, message: "Enter confirm Password!" });
  };
  
  const actualPassword= await Base64toId(Password);
  const actualConfirmPassword= await Base64toId(confirmPassword);
  if(actualPassword!=actualConfirmPassword){
    return res.status(400).json({ status: false, message: "Password does not match with confirm Password" });
  }
  
   if(!captcha){
    return res
    .status(400)
    .send({ status: false, message: "Enter captcha!" });
  }
  const captchImage = JSON.parse(localStorage.getItem('captcha'));
  if(!captchImage){
    return res
    .status(400)
    .send({ status: false, message: "Please enter valid Captcha!" });
  }
  
  const validateCaptch = await bcrypt.compare(
    req.body.captcha,
    captchImage?.hash,
  
  );
  if (!validateCaptch) {
    return res
      .status(400)
      .send({ status: false, message: "Please enter valid Captcha!" });
  }
  localStorage.clear()
  next()
  
  } 
module.exports={
    login,
    forgotPassword,
    resetPasswordRequest,
    changePassword
}
