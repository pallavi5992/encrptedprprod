const db = require("../../models");
const sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const helper = require("../../helper/helper");
const jwt = require("jsonwebtoken");
const IdexProject = db.idexmakeproject;

const addidexmakeprojectData = async (req, res) => {
  try {
    const {
      OrganisationID,
      ProjectID,
      ProjectName,
      ValueInCr,
      StartDate,
      EndDate,
      Financial,
      Pysical,
      Remarks,
    } = req.body;
    const token = req.headers["x-access-token"];  
    const actualToken=await encryptToToken(token);
    const decodeToken = jwt.decode(actualToken);
    const userId = decodeToken.id;

    await IdexProject.create({
      OrganisationID: OrganisationID,
      ProjectID: ProjectID,
      ProjectName: ProjectName,
      ValueInCr: ValueInCr,
      StartDate: StartDate,
      EndDate: EndDate,
      Financial: Financial,
      Pysical: Pysical,
      Remarks: Remarks,
      Deleted: "1",
      ModifiedBy: userId,
    });

    return res.status(200).send({
      status: true,
      message: "Idex Project Added Successfully",
    });
  } catch (error) {
    return res.status(400).send({ status: false, message: error.message });
  }
};

const getAllIdexProjectData = async (req, res) => {
    try {
      const idexData=[]
      const getAllData = await IdexProject.findAll({
        where: {
          Deleted: "1",
        },    
        order: [
          ["IdexMakeID", "DESC"], // Sorts by COLUMN in ascending order  
        ],
        attributes: [
          "IdexMakeID",
          "OrganisationID",
          "ProjectID",
          "ProjectName",
          "ValueInCr",
          "StartDate",
          "EndDate",
          "Financial",
          "Pysical",
          "Remarks",
          "Deleted",
        ],
      });
      for (let i = 0; i < getAllData.length; i++) {
        if (getAllData[i].IdexMakeID != req.IdexMakeID) {
            idexData.push({
            IdexMakeID: getAllData[i].IdexMakeID,
            OrganisationID: getAllData[i].OrganisationID,
            ProjectID:getAllData[i].ProjectID,
            ProjectName: getAllData[i].ProjectName,
            ValueInCr: getAllData[i].ValueInCr,
            StartDate: getAllData[i].StartDate,
            EndDate: getAllData[i].EndDate,
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
      result.dataItems = idexData.slice(startIndex, endIndex);
      result.totalItems = idexData.length;
      result.totalPage = Math.ceil(idexData.length / limit);
      result.currentPage = page;
      
      if (result.dataItems.length == 0) {
          return res
            .status(200)
            .send({ status: false, message: "Data not found", data: result });
      }
      
  
      return res.status(200).json({
        status: true,
        message: "List of Indigenization data",
        data: result,
      });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };
  const pieChartIdex = async (req,res)=>{         
    try {
        const idexData = [];
        const totalOrgCount = await IdexProject.count({
          where: { Deleted: "1" },
        });
        let totalAmount = await IdexProject.sum('ValueInCr',{
        where: { Deleted: "1" },
        });  
        const idexprData = await IdexProject.findAll({  
          attributes: [
            "IdexMakeID",
            "OrganisationID",
            "ProjectID",
            "ProjectName",
            "ValueInCr",
            "StartDate",
            "EndDate",
            "Financial",        
            "Pysical",
            "Remarks",
            "Deleted", 
            [sequelize.fn("COUNT", sequelize.col("OrganisationID")), "countOrganisation"],   
            [sequelize.fn("SUM", sequelize.col("ValueInCr")), "sumOfAmnt"],
            [sequelize.fn("AVG", sequelize.col("ValueInCr")), "avgOfAmnt"],
          ],
          group: ["OrganisationID"], 
          where: { Deleted: "1" },   
        });
        for (let i = 0; i < idexprData.length; i++) {
          if (idexprData[i].IdexMakeID != req.IdexMakeID) {
            
            const organisationName = idexprData[i].OrganisationID
              ? await helper.organName(idexprData[i].OrganisationID)
              : "";
              idexData.push({
              IdexMakeID: idexprData[i].IdexMakeID,
              OrganisationID: idexprData[i].OrganisationID,
              ProjectID: idexprData[i].ProjectID,
              ProjectName: idexprData[i].ProjectName,
              ValueInCr: idexprData[i].ValueInCr,
              StartDate:idexprData[i].StartDate,
              EndDate:idexprData[i].EndDate,
              Financial:idexprData[i].Financial,
              Pysical:idexprData[i].Pysical,
              Remarks: idexprData[i].Remarks || "",
              Deleted: idexprData[i].Deleted,
              countOrganisation: idexprData[i].dataValues.countOrganisation,
              sumOfAmnt:idexprData[i].dataValues.sumOfAmnt,
              avgOfAmnt: idexprData[i].dataValues.avgOfAmnt,
              OrganisationName: organisationName
            });
          }
        }
        return res.status(200).json({
            status: true,
            message: `Idex Project Percentage Found`,
            data: { totalOrgCount, totalAmount, idexData },
          });   
    } catch (error) {

        return res.status(500).send({
            status:false,
            message:error.message
        })
        
    }
  }
module.exports = {
  addidexmakeprojectData,
  getAllIdexProjectData,  
  pieChartIdex
};
