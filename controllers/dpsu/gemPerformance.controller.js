const db = require("../../models");
const sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const helper = require("../../helper/helper");
const jwt = require("jsonwebtoken");
const Organisation = db.organisation;
const gemPerformance = db.gemPerformance;
const tblYear = db.tblYear;

const addgemPerformanceData = async (req, res) => {
  try {
     const token = req.headers["x-access-token"];
     const actualToken=await encryptToToken(token);
     const decodeToken = jwt.decode(actualToken);
     const userId = decodeToken.id;
     const { OrganisationID, CurrentFY, Procurement, Percentage,SelectedMonth, Remarks } = req.body;
    await gemPerformance.create({
      OrganisationID: OrganisationID,
      CurrentFY: CurrentFY,
      Procurement: Procurement,
      Percentage: Percentage,
      SelectedMonth:SelectedMonth,
      Remarks: Remarks,
      Deleted: "1",
      ModifiedBy: userId,
    });
    return res.status(200).send({
      status: true,
      message: "Add GeM Performance Successfully",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const getAllgemPerformanceData = async (req, res) => {
  const geMData = [];
  try {
    const getAllData = await gemPerformance.findAll({
      where: {
        Deleted: "1",
      },
      order: [
        ["GemID", "DESC"], 
      ],
      attributes: [
        "GemID",
        "OrganisationID",
        "CurrentFY",
        "Procurement",
        "Percentage",
        "SelectedMonth",
        ["SelectedMonth", "formattedSelectedMonth"],
        "Remarks",
        "Deleted",
      ],
    });
    for (let i = 0; i < getAllData.length; i++) {
      if (getAllData[i].GemID != req.GemID) {
        geMData.push({
          GemID: getAllData[i].GemID,
          CurrentFY: getAllData[i].CurrentFY,
          Procurement: getAllData[i].Procurement,
          Percentage: getAllData[i].Percentage,
          SelectedMonth: getAllData[i].formattedSelectedMonth,
          Remarks: getAllData[i].Remarks || "",
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
    result.dataItems = geMData.slice(startIndex, endIndex);
    result.totalItems = geMData.length;
    result.totalPage = Math.ceil(geMData.length / limit);
    result.currentPage = page;
    
    if (result.dataItems.length == 0) {
        return res
          .status(200)
          .send({ status: false, message: "Data not found", data: result });
    }
    

    return res.status(200).json({
      status: true,
      message: "List of GeM performance data",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// const getprPerformanceById = async (req, res) => {
//   try {
//     const { ProductionID } = req.params;
//     const performanceData = [];
//     if (!ProductionID) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Please enter ProductionID" });
//     }
//     const prProd = await prPerformance.findOne({
//       where: {
//         ProductionID: ProductionID,
//       },
//       attributes: [
//         "ProductionID",
//         "OrganisationID",
//         "YearID",
//         "Cumulative",
//         "Quarter",
//         "Remarks",
//         "Deleted",
//       ],
//     });

//     performanceData.push({
//       OrganisationID: prProd.ProductionID,
//       OrganisationID: prProd.OrganisationID,
//       YearID: prProd.YearID,
//       Cumulative: prProd.Cumulative,
//       Quarter: prProd.Quarter,
//       Remarks: prProd.Remarks || "",
//       Deleted: prProd.Deleted,
//       FYear: prProd.YearID ? await helper.getFYear(prProd.YearID) : "",
//       OrganisationName: prProd.OrganisationID
//         ? await helper.organName(prProd.OrganisationID)
//         : "",
//     });

//     if (!prProd) {
//       return res.status(404).send({
//         status: false,
//         message: `Data ${ProductionID} not found`,
//       });
//     }
//     return res.status(200).send({
//       status: true,
//       message: "Data found Successfully",
//       data: performanceData,
//     });
//   } catch (error) {
//     return res.status(500).send({ status: false, message: error.message });
//   }
// };

// const updateprPerformanceById = async (req, res) => {
//   try {
//     const token = req.headers["x-access-token"];
//     const decodeToken = jwt.decode(token);
//     const userId = decodeToken.id;
//     const { ProductionID } = req.params;
//     const { OrganisationID, Cumulative, YearID, Quarter, Remarks } = req.body;
//     await prPerformance.update(
//       {
//         OrganisationID,
//         Cumulative,
//         YearID,
//         Quarter,
//         Remarks,
//         ModifiedBy: userId,
//       },
//       { where: { ProductionID } }
//     );

//     return res.status(200).send({
//       status: true,
//       message: `Organization updated successfully`,
//     });
//   } catch (error) {
//     return res.status(500).send({ status: false, message: error.message });
//   }
// };

// const deletePrProd = async (req, res) => {
//   try {
//     const { ProductionID } = req.params;
//     await prPerformance.update(
//       {
//         Deleted: "0",
//       },
//       {
//         where: {
//           ProductionID: ProductionID,
//         },
//       }
//     );

//     return res
//       .status(200)
//       .send({ status: true, message: "Organisation deleted successfully" });
//   } catch (error) {
//     return res.status(500).send({ status: false, message: error.message });
//   }
// };


/**
 * Function to pie chart org for production performance.
 * @param {obj} req, res, next
 * @returns {json} obj
 */
// const pieChartOrganisation = async (req, res) => {
//   try {
//     const performanceData = [];
//     const totalOrgCount = await Organisation.count({
//       where: { Deleted: "1" },
//     });
//     let totalCumulative = await prPerformance.sum('Cumulative',{
//     where: { Deleted: "1" },
//     });  
//     const prProd = await prPerformance.findAll({  
//       attributes: [
//         "ProductionID",
//         "YearID",
//         "OrganisationID",
//         "Cumulative",
//         "Quarter",
//         "Remarks",
//         "Deleted",
//         [sequelize.fn("COUNT", sequelize.col("OrganisationID")), "countOrganisation"],
//         [sequelize.fn("SUM", sequelize.col("Cumulative")), "SumofCumulative"],
//         [sequelize.fn("AVG", sequelize.col("Cumulative")), "avgCumulative"],
//       ],
//       group: ["OrganisationID"], 
//       where: { Deleted: "1" },   
//     });
//     for (let i = 0; i < prProd.length; i++) {
//       if (prProd[i].ProductionID != req.ProductionID) {
        
//         const organisationName = prProd[i].OrganisationID
//           ? await helper.organName(prProd[i].OrganisationID)
//           : "";
//         const FYear = prProd[i].YearID
//           ? await helper.getFYear(prProd[i].YearID)                                     
//           : "";
//         performanceData.push({
//           ProductionID: prProd[i].ProductionID,
//           OrganisationID: prProd[i].OrganisationID,
//           YearID: prProd[i].YearID,
//           Cumulative: prProd[i].Cumulative,
//           Quarter: prProd[i].Quarter,
//           Remarks: prProd[i].Remarks || "",
//           Deleted: prProd[i].Deleted,
//           countOrganisation: prProd[i].dataValues.countOrganisation,
//           SumofCumulative:prProd[i].dataValues.SumofCumulative,
//           avgCumulative: prProd[i].dataValues.avgCumulative,
//           FYear: FYear,
//           OrganisationName: organisationName,
//         });
//       }
//     }

//     return res.status(200).json({
//       status: true,
//       message: `Organisation Percentage Found`,
//       data: { totalOrgCount, totalCumulative, performanceData },
//       //data:  { totalOrgCount,percentageOrganisationByName }
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

module.exports = {
    addgemPerformanceData,
    getAllgemPerformanceData
 
};
