const db = require("../models");
const User = db.user;
const Role = db.role;
const { default: isEmail } = require("validator/lib/isEmail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Base64toId } = require("../helper/idIntoBase64");
const { LocalStorage } = require('node-localstorage');
// const a=require("../../uploads")
const localStorage = new LocalStorage("../../uploads/scratch");

const addUser = async (req, res, next) => {
  try {
    const {
      Email_Id,
      User_Name,
      Password,
      Organisation,
      Designation,
      captcha,
      Mobile_No,
      personalNumber,
      ModifiedBy,
      UserType,
    } = req.body;

    if (!UserType) {
      return res
        .status(400)
        .send({ status: false, message: "Please select user type!" });
    } 
    else if(!/^[a-zA-Z0-9\s]*$/.test(UserType)){
      return res
      .status(400)
      .send({ status: false, message: "Special characters are not allowed in role!" });
    }
    else if (!User_Name) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter name!" });
    } 
    else if(!/^[a-zA-Z0-9\s]*$/.test(UserType)){
      return res
      .status(400)
      .send({ status: false, message: "Special characters are not allowed in name!" });
    }
    else if (!Email_Id) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter email address!" });
    } else if (!isEmail(Email_Id)) {
      return res
        .status(400)
        .send({ status: false, message: "Please valid email address!" });
    }
     else if (!Mobile_No) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter mobile number!" });
    } else if (isNaN(Mobile_No)) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid mobile number!",
      });
    } else if (Mobile_No.length != 10) {
      return res.status(400).send({
        status: false,
        message: "Please enter 10 digits valid mobile number!",
      });
    } 

     if (personalNumber) {
      if (isNaN(personalNumber)) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid mobile number!",
      });
    } else if (Mobile_No.length != 10) {
      return res.status(400).send({
        status: false,
        message: "Please enter 10 digits valid mobile number!",
      });
    } 
  }
    
     if (!Organisation) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter organisation name!" });
    } else if (!Designation) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter designation name!" });
    } else if (!Password) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter password!" });
    }

    const isRoleExist = await Role.findOne({
      where: {
        Role: UserType,
      },
    });
    if (!isRoleExist) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid user type!" });
    }

    const isEmailExist = await User.findOne({
      where: {
        Email_Id: Email_Id,
      },
    });
    if (isEmailExist) {
      return res
        .status(400)
        .send({ status: false, message: "Email address already exist!" });
    }
    const isMobileNumberExist = await User.findOne({
      where: {
        Mobile_No: Mobile_No,
      },
    });
    if (isMobileNumberExist) {
      return res
        .status(400)
        .send({ status: false, message: "Mobile number already taken!" });
    }

    if (!captcha) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter captcha!" });
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

    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.query.id;
    const user = await User.findOne({
      where: {
        UserId: userId,
        Deleted: "0",
      },
    });
    if (user) {
      return res.status(400).send({ status: false, message: "User not found" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const updateUserByToken = async (req, res, next) => {
  try {
    const {
      Designation,
      Organisation,
      personalNumber,
      captcha,
      Mobile_No,
      oldPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    const [actualNewPassword, actualconfirmPassword, actualoldPassword] = await Promise.all([
        Base64toId(newPassword),
        Base64toId(confirmPassword),
        Base64toId(oldPassword),
      ]);

    const token = req.headers["x-access-token"];
    const decodeToken = jwt.decode(token);
    const userId = decodeToken.id;
    const user = await User.findOne({
      where: {
        UserId: userId,
      },
    });
    if (!captcha) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter captcha!" });
    }
    const captchImage = JSON.parse(localStorage.getItem('captcha'));
    if(!captchImage){
      return res
      .status(400)
      .send({ status: false, message: "Please enter valid Captcha!" });
    }

    const validateCaptch = await bcrypt.compare(      
      req.body.captcha,
      captchImage?.hash,);

    if (!validateCaptch) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid Captcha!" });
    }
    if (!user) {
      return res.status(400).send({ status: false, message: "User not found" });
    }

    if (personalNumber) {
      if (isNaN(personalNumber)) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid personal number!",
      });
    } else if (Mobile_No.length != 10) {
      return res.status(400).send({
        status: false,
        message: "Please enter 10 digits valid mobile number!",
      });
    } 
  }

    if (actualNewPassword) {
      if (!actualoldPassword) {
        return res
          .status(400)
          .send({ status: false, message: "Please enter old password" });
      } else if (!actualNewPassword) {
        return res
          .status(400)
          .send({ status: false, message: "Please enter new password" });
      } else if (!actualconfirmPassword) {
        return res
          .status(400)
          .send({ status: false, message: "Please enter old password" });
      } else if (actualNewPassword != actualconfirmPassword) {
        return res
          .status(400)
          .send({ status: false, message: "New passwords do not match" });
      }
      const isOldPassword = await bcrypt.compare(
        actualoldPassword,
        user?.Password
      );
      if (!isOldPassword) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid old password!" });
      }
    }
    if (Mobile_No) {
      if (isNaN(Mobile_No)) {
        return res.status(400).send({
          status: false,
          message: "Please enter valid mobile number!",
        });
      } else if (Mobile_No.length != 10) {
        return res.status(400).send({
          status: false,
          message: "Please enter 10 digits valid mobile number!",
        });
      }
      const isMobileNumberExist = await User.findOne({
        where: {
          Mobile_No: Mobile_No,
        },
      });
      if (isMobileNumberExist) {
        if (isMobileNumberExist.UserId != userId) {
          return res.status(400).send({
            status: false,
            message: "Mobile number already taken!",
          });
        }
      }
    }
    if (actualoldPassword && actualNewPassword && actualoldPassword === actualNewPassword) {
      return res.status(400).send({ status: false, message: "New password must be different from old password" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const updateUserById = async (req, res, next) => {
  try {
    const { captcha, Mobile_No, personalNumber } = req.body;
    const userId = req.query.userId;
    const actualId = await Base64toId(userId);

    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter userId!" });
    }
    const user = await User.findOne({
      where: {
        UserId: actualId,
      },
    });
    if (!captcha) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter captcha!" });
    }

    const captchImage = JSON.parse(localStorage.getItem('captcha'));
    // console.log(captchaStore,"captchaStorecaptchaStorecaptchaStorecaptchaStorecaptchaStore");
    if(!captchImage){
      return res
      .status(400)
      .send({ status: false, message: "Please enter valid Captcha!" });
    }
    const validateCaptch = await bcrypt.compare( req.body.captcha,
      captchImage?.hash,);
    if (!validateCaptch) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid Captcha!" });
    }
    if (!user) {
      return res.status(400).send({ status: false, message: "User not found" });
    }

    if (Mobile_No) {
      if (isNaN(Mobile_No)) {
        return res.status(400).send({
          status: false,
          message: "Please enter valid mobile number!",
        });
      } else if (Mobile_No.length != 10) {
        return res.status(400).send({
          status: false,
          message: "Please enter 10 digits valid mobile number!",
        });
      }
      const isMobileNumberExist = await User.findOne({
        where: {
          Mobile_No: Mobile_No,
        },
      });
      if (isMobileNumberExist) {
        if (isMobileNumberExist.UserId != actualId) {
          return res.status(400).send({
            status: false,
            message: "Mobile number already taken!",
          });
        }
      }
    }
    if (personalNumber) {
      if (isNaN(personalNumber)) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid mobile number!",
      });
    } else if (Mobile_No.length != 10) {
      return res.status(400).send({
        status: false,
        message: "Please enter 10 digits valid mobile number!",
      });
    } 
  }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
module.exports = {
  addUser,
  deleteUser,
  updateUserByToken,
  updateUserById,
};
