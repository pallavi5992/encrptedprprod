const db = require("../../models");    
const sequelize = require("sequelize");   
const bcrypt = require("bcryptjs");   
const helper = require("../../helper/helper");
const jwt = require("jsonwebtoken");
const Major = db.majorachievments;
const Organisation = db.organisation;
const majorachievmentData = async (req, res) => {         
  try {     
    const {
      OrganisationID,
      Achievement,
      ValueInCr,
      SelectedMonth,
      Remarks,
    } = req.body;
    const token = req.headers["x-access-token"];
    const actualToken=await encryptToToken(token);
    const decodeToken = jwt.decode(actualToken);     
    const userId = decodeToken.id;
   
    await Major.create({    
      OrganisationID: OrganisationID,
      MajorAchievement: Achievement,
      ValueInCr:ValueInCr,
      SelectedMonth:SelectedMonth,
      Remarks: Remarks,
      Deleted: "1",
      ModifiedBy: userId,
    });

    return res.status(200).send({
      status: true,
      message: "Major Achievments Added Successfully",
    });
  } catch (error) {
    return res.status(400).send({ status: false, message: error.message });
  }
};
const getAllmajorachievmentData = async (req, res) => {
  try {
    const mordenData =[]
    const getAllData = await Major.findAll({   
      where: {
        Deleted: "1",
      },
      order: [
        ["MajorID", "DESC"], // Sorts by COLUMN in ascending order         
      ],
      attributes: [
        "MajorID",
        "OrganisationID",
        "MajorAchievement",
        "ValueInCr",
        "SelectedMonth",
        ["SelectedMonth", "formattedSelectedMonth"],
        "Remarks",
        "Deleted",
      ],
    });
    for (let i = 0; i < getAllData.length; i++) {
      if (getAllData[i].MajorID != req.MajorID) {
        mordenData.push({
          MajorID: getAllData[i].MajorID,
          OrganisationID: getAllData[i].OrganisationID,
          MajorAchievement: getAllData[i].MajorAchievement,
          ValueInCr: getAllData[i].ValueInCr,
          SelectedMonth: getAllData[i].formattedSelectedMonth,
          Remarks: getAllData[i].Remarks || "",
          Deleted: getAllData[i].Deleted,
          OrganisationName: getAllData[i].OrganisationID
            ? await helper.organName(getAllData[i].OrganisationID)
            : "",
        });
      }
    }
    const page = parseInt(req.query.page) || 0;
    const limit = req.query.limit || 10;
    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;
    const result = {};
    result.dataItems = mordenData.slice(startIndex, endIndex);
    result.totalItems = mordenData.length;
    result.totalPage = Math.ceil(mordenData.length / limit);  
    result.currentPage = page;

    if (result.dataItems.length == 0) {
      return res.status(200).json({
        status: true,
        message:"No data found",
        data: result,
      });
    } else {
      return res.status(200).json({
        status: true,
        message:  "List of Modern Project data",
        data: result,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = {
    majorachievmentData,
    getAllmajorachievmentData
};
