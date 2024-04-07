const db = require("../../models");
const sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const helper = require("../../helper/helper");
const jwt = require("jsonwebtoken");
const Project = db.newproject

const projectData = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const actualToken=await encryptToToken(token);
    const decodeToken = jwt.decode(actualToken);
    const userId = decodeToken.id;
    const {
      OrganisationID,
      ProjectName,
      ProjectValue,
      StartDate,
      CompletionDate,
      Financial,
      Pysical,
      Remarks,
    } = req.body;
    await Project.create({
      OrganisationID: OrganisationID,
      ProjectName: ProjectName,
      ProjectValue: ProjectValue,
      StartDate: StartDate,
      CompletionDate:CompletionDate,
      Financial:Financial,
      Pysical:Pysical,
      Remarks: Remarks,
      Deleted: "1",
      ModifiedBy: userId,
    });
    return res.status(200).send({
      status: true,
      message: "New Project Added Successfully",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getAllProject = async (req, res) => {
  try {
    const  projectData =[]
    const getAllData = await Project.findAll({
      where: {
        Deleted: "1",
      },    
      order: [
        ["ProjectID", "DESC"], // Sorts by COLUMN in ascending order
      ],
      attributes: [
        "ProjectID",
        "OrganisationID",
        "ProjectName",
        "ProjectValue",
        "StartDate",
        "CompletionDate",
        "Financial",
        "Pysical",
        "Remarks",
        "Deleted",
      ]
    });
    for (let i = 0; i < getAllData.length; i++) {
      if (getAllData[i].ProjectID != req.ProjectID) {         
        projectData.push({
          ProjectID: getAllData[i].ProjectID,
          OrganisationID: getAllData[i].OrganisationID,
          ProjectName: getAllData[i].ProjectName,
          ProjectValue: getAllData[i].ProjectValue,
          StartDate: getAllData[i].StartDate,
          CompletionDate: getAllData[i].CompletionDate,

          Financial: getAllData[i].Financial,
          Pysical: getAllData[i].Pysical,

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
    result.dataItems = projectData.slice(startIndex, endIndex);
    result.totalItems = projectData.length;
    result.totalPage = Math.ceil(projectData.length / limit);  
    result.currentPage = page;
    if (result.dataItems.length == 0) {
      return res.status(200).json({
        status: true,
        message: "No data found", 
        data: result,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "List of new project data",
        data: result,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const pieChartProject =async (req,res)=>{
  try {
    const projectData = [];
    const totalOrgCount = await Project.count({
      where: { Deleted: "1" },
    });
    let totalAmount = await Project.sum('ProjectValue',{
    where: { Deleted: "1" },
    });  
    const newPrData = await Project.findAll({
      attributes: [
        "ProjectID",
        "OrganisationID",
        "ProjectName",
        "ProjectValue",
      
        "Remarks",
        "Deleted",
        [sequelize.fn("COUNT", sequelize.col("OrganisationID")), "countOrganisation"],   
        [sequelize.fn("SUM", sequelize.col("ProjectValue")), "sumOfAmnt"],
        [sequelize.fn("AVG", sequelize.col("ProjectValue")), "avgOfAmnt"],
      ],
      group: ["OrganisationID"], 
      where: { Deleted: "1" },   
    });
    for (let i = 0; i < newPrData.length; i++) {
      if (newPrData[i].ProjectID != req.ProjectID) {
               
        const organisationName = newPrData[i].OrganisationID
          ? await helper.organName(newPrData[i].OrganisationID)
          : "";
          projectData.push({
          ProjectID: newPrData[i].ProjectID,
          OrganisationID: newPrData[i].OrganisationID,
          ProjectName:newPrData[i].ProjectName,
          ProjectValue: newPrData[i].ProjectValue,
         
          Remarks: newPrData[i].Remarks || "",
          Deleted: newPrData[i].Deleted,
          countOrganisation: newPrData[i].dataValues.countOrganisation,
          sumOfAmnt:newPrData[i].dataValues.sumOfAmnt,
          avgOfAmnt: newPrData[i].dataValues.avgOfAmnt,
          OrganisationName: organisationName
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: `New Project Found`,
      data: { totalOrgCount, totalAmount, projectData },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    })
  }
}
module.exports = {
  projectData,
  getAllProject,
  pieChartProject
 
};
