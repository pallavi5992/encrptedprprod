const db = require("../../models");
const sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const helper = require("../../helper/helper");
const jwt = require("jsonwebtoken");
const Morden = db.modernisationcapex;
const modernisationcapexData = async (req, res) => {
  try {
    const {
      OrganisationID,
      ProjectID,
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

    await Morden.create({
      OrganisationID: OrganisationID,
      ProjectID:ProjectID,
      ValueInCr:ValueInCr,
      StartDate:StartDate,
      EndDate:EndDate,
      Financial:Financial,
      Pysical:Pysical,
      Remarks: Remarks,
      Deleted: "1",
      ModifiedBy: userId,
    });

    return res.status(200).send({
      status: true,
      message: "modernisation Capex Added Successfully",
    });
  } catch (error) {
    return res.status(400).send({ status: false, message: error.message });
  }
};
const getAllmodernisationcapexData = async (req, res) => {
  try {
    const modernCapexData =[]
      const getAllData = await Morden.findAll({
      where: {
        Deleted: "1",
      },
      order: [
        ["ModernCapexID", "DESC"], // Sorts by COLUMN in ascending order
      ],
      attributes: [
        "ModernCapexID",
        "OrganisationID",
        "ProjectID",
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
      if (getAllData[i].ModernCapexID != req.ModernCapexID) {
        modernCapexData.push({
          ModernCapexID: getAllData[i].ModernCapexID,
          OrganisationID: getAllData[i].OrganisationID,
          ProjectID:getAllData[i].ProjectID,
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
    result.dataItems = modernCapexData.slice(startIndex, endIndex);
    result.totalItems = modernCapexData.length;
    result.totalPage = Math.ceil(modernCapexData.length / limit);
    result.currentPage = page;
    
    if (result.dataItems.length == 0) {
        return res
          .status(200)
          .send({ status: false, message: "Data not found", data: result });
    }
    
    return res.status(200).json({
      status: true,
      message: "List Of Modern Capex Data",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const pieChartMordenCapex =async (req,res)=>{
  try {
    const MordenData = [];
    const totalOrgCount = await Morden.count({
      where: { Deleted: "1" },
    });
    let totalAmount = await Morden.sum('ValueInCr',{
    where: { Deleted: "1" },
    });  
    const capexData = await Morden.findAll({
      attributes: [
        "ModernCapexID",
        "OrganisationID",
        "ProjectID",
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
    for (let i = 0; i < capexData.length; i++) {
      if (capexData[i].ModernCapexID != req.ModernCapexID) {
        
        const organisationName = capexData[i].OrganisationID
          ? await helper.organName(capexData[i].OrganisationID)
          : "";
          MordenData.push({
          ModernCapexID: capexData[i].ModernCapexID,
          OrganisationID: capexData[i].OrganisationID,   
          ProjectID: capexData[i].ProjectID,
          ValueInCr: capexData[i].ValueInCr,
          StartDate:capexData[i].StartDate,
          EndDate:capexData[i].EndDate,
          Financial:capexData[i].Financial,
          Pysical:capexData[i].Pysical,
          Remarks: capexData[i].Remarks || "",
          Deleted: capexData[i].Deleted,
          countOrganisation: capexData[i].dataValues.countOrganisation,
          sumOfAmnt:capexData[i].dataValues.sumOfAmnt,
          avgOfAmnt: capexData[i].dataValues.avgOfAmnt,
          OrganisationName: organisationName
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: `Indigenization Percentage Found`,
      data: { totalOrgCount, totalAmount, MordenData },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    })
  }
}

module.exports = {
    modernisationcapexData,
    getAllmodernisationcapexData,
    pieChartMordenCapex
};
