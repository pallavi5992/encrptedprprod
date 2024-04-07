const db = require("../models");
const User = db.user;
const Role = db.role;
const bcrypt = require("bcryptjs");
const helper = require("../helper/helper");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const{idIntoBase64,Base64toId, encryptToToken}=require('../helper/idIntoBase64')
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage("../../uploads/scratch");

const addUser = async (req, res) => {
  try {
    const {
      Email_Id,
      User_Name,
      Password,
      Organisation,
      Designation,
      Mobile_No,
      ModifiedBy,
      UserType,
      personalNumber,
    } = req.body;
    const isRoleId = await Role.findOne({   
      where: {
        Role: UserType,
      },
    });
    const actualPassword= await Base64toId(Password) 
     await User.create({
      User_Name: User_Name,
      UserType: isRoleId?.RoleId,
      Email_Id: Email_Id,
      personalNumber: personalNumber,    
      Password: Password ? bcrypt.hashSync(actualPassword, 8) : null, 
      Organisation: Organisation,
      Designation: Designation,
      Mobile_No: Mobile_No || null,
      ModifiedOn: new Date(),
      ModifiedBy: ModifiedBy ? ModifiedBy : 1,
      Deleted: "1",
      firstLogin:"0"
    });
    localStorage.clear()
    return res
      .status(200)
      .send({ status: true, message: "User added sccessfully!" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getAllUserData = async (req, res) => {
  const userData = [];

    const users = await User.findAll({
    where: {
      Deleted: "1",
    },
    attributes: [
      "UserId",
      "User_Name",
      "Email_Id",
      "Mobile_No",
      "Designation",
      "Organisation",
      "UserType",
      "personalNumber",
    ],
    order:[["UserId","DESC"]]
  });

  for (let i = 0; i < users.length; i++) {
    const encryptId = await idIntoBase64(users[i].UserId)
  
    if (users[i].UserId != req.userId) {
      userData.push({
        id: encryptId,
        // id: users[i].UserId,
        userName: users[i].User_Name,
        emailId: users[i].Email_Id,
        mobileNo: users[i].Mobile_No,
        designation: users[i].Designation || "",
        organisation: users[i].Organisation || "",
        role: users[i].UserType ? await helper.getRole(users[i].UserType) : "",
        personalNumber: users[i].personalNumber || "",
        moduleName:users[i].UserType ? await helper.getRole(users[i].UserType)=="Super Admin"|| await helper.getRole(users[i].UserType)=="Module Admin"?["All"]: await helper.userModuleAssign(users[i].UserId):"",
      });
    }
  }

  const page = parseInt(req.query.page) || 0;
  const limit = req.query.limit || 10;
  const startIndex = page * limit;
  const endIndex = (page + 1) * limit;
  const result = {};
  result.dataItems = userData.slice(startIndex, endIndex);
  result.totalItems = userData.length;
  result.totalPage = Math.ceil(userData.length / limit);
  result.currentPage = page;

  if (result.dataItems.length == 0) {
    return res
      .status(200)
      .send({ status: false, message: "Data not found", data: result });
  }

  return res
    .status(200)
    .send({ status: true, message: "Data found", data: result });
};

const updateUserByToken = async (req, res) => {
  try {
    const {
      useName,
      Designation,
      Organisation,
      Mobile_No,
      newPassword,
      personalNumber,
    } = req.body;
    const token = req.headers["x-access-token"];
    const decodeToken = jwt.decode(token);
    const userId = decodeToken.id;
    const user = await User.findOne({
      where: {
        UserId: userId,
      },
    });
    const actualPassword= await Base64toId(newPassword)

    await User.update(
      {
        User_Name: useName ? useName : user.User_Name,
        Designation: Designation ? Designation : user.Designation,
        Organisation: Organisation ? Organisation : user.Organisation,
        Mobile_No: Mobile_No ? Mobile_No : user.Mobile_No,
        personalNumber: personalNumber ? personalNumber : user.personalNumber,
        Password: newPassword ? bcrypt.hashSync(actualPassword, 8) : user.Password,
      },
      {
        where: {
          UserId: userId,
        },
      }
    );
    localStorage.clear()
    return res
      .status(200)
      .send({ status: true, message: "User Updated successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getUserByToken = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const actualToken=await encryptToToken(token)
    const decodeToken = jwt.decode(actualToken);
    const userId = decodeToken.id;
    console.log(userId);
    const user = await User.findOne({
      where: {
        UserId: userId,
      },
      attributes: [
        "User_Name",
        "Email_Id",
        "Mobile_No",
        "UserType",
        "personalNumber",
        "Organisation",
        "Designation",
      ],
    });
    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "User not found", data: user });
    }
    const data = {
      role: await helper.getRole(user.UserType),
      userName: user.User_Name,
      email: user.Email_Id,
      mobileNo: user?.Mobile_No || "",
      personalNumber: user?.personalNumber || "",
      organisation: user?.Organisation || "",
      designation: user.Designation || "",
    };
    localStorage.clear()
    return res
      .status(200)
      .send({ status: true, message: "User found successfully", data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.query.userId;
    const actualId =await Base64toId(userId)
    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter userId" });
    }
    const user = await User.findOne({
      where: {
        UserId: actualId,
      },
      attributes: [
        "User_Name",
        "Email_Id",
        "Mobile_No",
        "UserType",
        "personalNumber",
        "Organisation",
        "Designation",
      ],
    });
    if (!user) {
      return res.status(400).send({
        status: false,
        message: "User not found",
        data: user ? user : "",
      });
    }
    const data = {
      role: await helper.getRoleforLogin(user.UserType),
      userName: user.User_Name,
      email: user.Email_Id,
      mobileNo: user?.Mobile_No || "",
      personalNumber: user?.personalNumber || "",
      organisation: user?.Organisation || "",
      designation: user.Designation || "",
    };
    return res
      .status(200)
      .send({ status: true, message: "User found successfully", data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const {
      role,
      userName,
      Designation,
      Organisation,
      Mobile_No,
      personalNumber,
    }  = req.body;
    const userId = req.query.userId;
    const actualId = await Base64toId(userId)

    const logInUserId = req.userId;
    const isRole = await Role.findOne({
      where: {
        Role: role,
      },
    });
    const user = await User.findOne({
      where: {
        UserId: actualId,
      },
    });
   
    await User.update(
      {
        UserType: role ? isRole?.RoleId : user?.RoleId,
        User_Name: userName ? userName : user.User_Name,
        Designation: Designation ? Designation : user.Designation,
        Organisation: Organisation ? Organisation : user.Organisation,
        Mobile_No: Mobile_No ? Mobile_No : user.Mobile_No,
        personalNumber: personalNumber ? personalNumber : user.personalNumber,
        ModifiedBy: logInUserId,
      },
      {
        where: {
          UserId: actualId,
        },
      }
    );
    localStorage.clear()
    return res
      .status(200)
      .send({ status: true, message: "User Updated successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.query.id;
      const actualId = await Base64toId(userId)

    await User.update(
      {
        Deleted: "0",
      },
      {
        where: {
          UserId: actualId,
        },
      }
    );
    return res
      .status(200)
      .send({ status: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const getAllUserNameId = async (req, res) => {
  try {
    const IsSuperAdminRole = await Role.findOne({
      where: {
        Role: "SuperAdmin",
      },
    });
    const IsAdminRole = await Role.findOne({
      where: {
        Role: "Admin",
      },
    });
    const user = await User.findAll({
      where: {
        Deleted: "1",
        UserType:{
          [Op.notIn]: [IsSuperAdminRole?.RoleId, IsAdminRole?.RoleId],
        }
      },
      attributes: ["UserId", "User_Name"],
      order:[["UserId","DESC"]]
    });

    return res
      .status(200)
      .send({ status: true, message: "User found successfully", data: user });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const searchUser = async (req, res) => {
  try {
    const { key } = req.params;
    console.log(key);
    const AllData = [];
    const role = await Role.findOne({
      where: {
        [Op.or]: [{ Role: { [Op.like]: `%${key}%` } }],
      },
    });

    if (role) {
      const userData = await User.findAll({
        where: {
          UserType: role.RoleId,
        },
        attributes: [
          "User_Name",
          "Email_Id",
          "Mobile_No",
          "Designation",
          "Organisation",
          "personalNumber",
          "UserType",
          "UserId"
        ],
      });

      for (let i = 0; i < userData.length; i++) {
        if (userData.length > 0) {
           AllData.push({
            id: userData[i].UserId,
            userName: userData[i].User_Name,
            emailId: userData[i].Email_Id,
            mobileNo: userData[i].Mobile_No,
            designation: userData[i].Designation || "",
            organisation: userData[i].Organisation || "",
            personalNumber: userData[i].personalNumber || "",
            role: userData[i].UserType
              ? await helper.getRole(userData[i].UserType)
              : "",
              moduleName:userData[i].UserType ? await helper.getRole(userData[i].UserType)=="Super Admin"|| await helper.getRole(userData[i].UserType)=="Module Admin"?["All"]: await helper.userModuleAssign(userData[i].UserId):"",
          });
        }
      };
      return res
        .status(200)
        .send({ status: true, message: "Data found ", data: AllData });
    } else {
      const userData = await User.findAll({
        attributes: [
          "User_Name",
          "Email_Id",
          "Mobile_No",
          "Designation",
          "Organisation",
          "personalNumber",
          "UserType",
          "UserId"
        ],
        where: {
          [Op.or]: [
            { User_Name: { [Op.like]: `%${key}%` } },
            { Email_Id: { [Op.like]: `%${key}%` } },
            { Mobile_No: { [Op.like]: `%${key}%` } },
            { Designation: { [Op.like]: `%${key}%` } },
            { Organisation: { [Op.like]: `%${key}%` } },
            { personalNumber: { [Op.like]: `%${key}%` } },
          ],
        },
      });

      for (let i = 0; i < userData.length; i++) {
        if (userData.length > 0) {
          AllData.push({
            id: userData[i].UserId,
            userName: userData[i].User_Name,
            emailId: userData[i].Email_Id,
            mobileNo: userData[i].Mobile_No,
            designation: userData[i].Designation || "",
            organisation: userData[i].Organisation || "",
            personalNumber: userData[i].personalNumber || "",
            role: userData[i].UserType
              ? await helper.getRole(userData[i].UserType)
              : "",
              moduleName:userData[i].UserType ? await helper.getRole(userData[i].UserType)=="Super Admin"|| await helper.getRole(userData[i].UserType)=="Module Admin"?["All"]: await helper.userModuleAssign(userData[i].UserId):"",
          });
        }
      }
      return res
        .status(200)
        .send({ status: true, message: "Data found ", data: AllData });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  addUser,
  getAllUserData,
  deleteUser,
  updateUserByToken,
  getUserByToken,
  getUserById,
  updateUserById,
  getAllUserNameId,
  searchUser
};
