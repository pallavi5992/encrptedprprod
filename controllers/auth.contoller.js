const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const helper = require("../helper/helper");
const  {sendEmail}  = require("../helper/sendmail");
const {Op}=require("sequelize");
const crypto=require("crypto");
const { LocalStorage } = require('node-localstorage');
const { tokenIntoEncrypt, encryptToToken, idIntoBase64, Base64toId } = require("../helper/idIntoBase64");
const localStorage = new LocalStorage("../../uploads/scratch");
// idIntoBase64

const login = async (req, res) => {
  try {
    const { emailId } = req.body;
    const user = await User.findOne({
      where: {
        Email_Id: emailId,
      },
    });
    if (!user) {
      return res.status(404).send('User not found');
    }
    if (user.firstLogin == "0") {
      const userId = await idIntoBase64(user.UserId)
      return res.status(200).send({
        status: true, data: {
          id: userId, firstLogin: user.firstLogin
        }
      })
    }
     const payloads = {
      id: user.UserId,
      role: await helper.getRoleforLogin(user.UserType),
    };   
    // expiry time=60second
    const token = await jwt.sign(payloads, process.env.JWT_Secret_Key, {
      expiresIn: 60*60,
    });
    const atutalToken=token
    const encriptToken=await tokenIntoEncrypt(atutalToken)
    // return res.send(token)
     
    await User.update(
      {
        accessToken: encriptToken,
      },
      {
        where: {
          UserId: user?.UserId,
        },
      }
    );
    const data={
        id:user.UserId,
        userName:user.User_Name,
        role: await helper.getRole(user.UserType),
        accessToken:encriptToken,
        firstLogin: user.firstLogin

    };
    localStorage.clear()

    return res.status(200).send({status:true,message:"Login successfully",data:data})
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const logout = async (req, res) => {
  try {
   const token=req.headers["x-access-token"];  
   const newToken=null;
   const actualToken=await encryptToToken(token);
   const tokenData=jwt.decode(actualToken);
   const user=await User.findOne({
    where:{
      UserId:tokenData.id
    }
   })
   if(!user){
    return res.status(401).send({status:false,message:"Unauthorized"})
   }
    await User.update(
      {
        accessToken: newToken,
      },
      {
        where: {
          UserId: user.UserId,
        },
      }
    );
    
    return res.status(200).send({status:true,message:"Logout successfully"})
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

const forgotPassword = async (req, res) => {
  const { emailId } = req.body;
  const user = await User.findOne({
    where: {
      Email_Id: emailId,
    },
  });
  if (!user) {
    return res.status(400).send({ status: false, message: "You will get the password reset Link in your email id, if it exists in records!" });
  }
  const resetToken = user.createResetPasswordToken();
  await user.save();

  const resetUrl = `https://ddpdashboard.dpit-ddpmod.online/admin/index/reset/password/${resetToken}`;
  const message = ` Dear User,\n Your password Reset Link\n${resetUrl}\n\n kindly Reset Your password\n Regards\nDDP Dashboard Team\nNote:- This is a sysytem genrated e-mail, Please do not replay to it`;
  const subject = "password change request recevied";



  await sendEmail(user.Email_Id, subject, message);
 return res.status(200).json({
    status: true,
    message: "password reset Link send to the  user email",
  });
};

const resetPasswordRequest = async (req, res) => {
  try {
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
      const user = await User.findOne({
      where: {
        PasswordResetToken: token,
        PasswordResetTokenExpire: { [Op.gt]: Date.now()},
      },
    });

    if (!user) {
      return res.status(400).json({ status: false, message: "Reset password Link has Expired" });
    }

    if (req.body.Password !== req.body.confirmPassword) {
      return res.status(400).json({ status: false, message: "Password does not match" });
    }


    const hashedPassword = bcrypt.hashSync(req.body.Password, 8);
    user.Password = hashedPassword;

    user.PasswordResetToken = null;
    user.PasswordResetTokenExpire = null;
    user.PasswordChangeAt = Date.now();

    await user.save();

    const payloads = {
      userId: user.UserId,
    };

    const loginToken = jwt.sign(payloads, process.env.JWT_Secret_Key, {
      expiresIn: 60 * 60,
    });

    await User.update(
      {
        accessToken: loginToken,
      },
      {
        where: {
          UserId: user.UserId,
        },
      }
    );
    
    return res.status(200).json({
      status: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
const changePassword = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { Password } = req.body;
    const actualUserId = await Base64toId(userId);


    const actualPassword = await Base64toId(Password);
    // const actualConfirmPassword= await Base64toId(confirmPassword);

    await User.update(
      {
        Password: actualPassword ? bcrypt.hashSync(actualPassword, 8) : null,
        firstLogin: "1"
      },
      {
        where: {
          UserId: parseInt(actualUserId),
        },
      }
    );

    return res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = {
  login,
  logout,
  forgotPassword,
  resetPasswordRequest,
  changePassword
};


