
const crypto = require("crypto");
const db = require("../../models");
const sequelize = require("sequelize");
const helper = require("../../helper/helper");
const jwt = require("jsonwebtoken");
const { encryptToToken, encryptData, decryptData, decryptDataToActual } = require("../../helper/idIntoBase64");
const Organisation = db.organisation;
const prPerformance = db.prProduction;
const tblYear = db.tblYear;

const addprPerformanceData = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const actualToken = await encryptToToken(token);
    const decodeToken = jwt.decode(actualToken);
    const userId = decodeToken.id;
    const { OrganisationID, Cumulative, YearID, Quarter, Remarks } = req.body;
    // Convert data to strings
    const OrganisationIDString = OrganisationID.toString().trim();;
    const YearIDString = YearID.toString().trim();;
    const QuarterString = Quarter.toString().trim();;

    // Encrypt data
    const encryptedOrganisationID = encryptData(OrganisationIDString);

    const encryptedYearID = encryptData(YearIDString);
    const encryptedQuarter = encryptData(QuarterString);

    // Generate hash based on encrypted data
    const concatenatedData = `${encryptedOrganisationID.encryptedData}.${encryptedYearID.encryptedData}.${encryptedQuarter.encryptedData}`;

    // Calculate hash
    const hash = crypto.createHash('sha256').update(concatenatedData).digest('hex');
    console.log("Concatenated Data:", concatenatedData);
    console.log("Hash:", hash);
    // Check for existing record with the same hash
    const existingRecord = await prPerformance.findOne({
      where: {
        EncryptedHash: hash
      }
    });
    // If record already exists, return error response
    if (existingRecord) {
      return res.status(400).send({
        status: false,
        message: "Record already exists"
      });
    }

    // Insert new record into the database
    await prPerformance.create({
      OrganisationID: encryptedOrganisationID.encryptedData + '.' + encryptedOrganisationID.key + '.' + encryptedOrganisationID.iv,
      Cumulative: Cumulative,
      YearID: encryptedYearID.encryptedData + '.' + encryptedYearID.key + '.' + encryptedYearID.iv,
      Quarter: encryptedQuarter.encryptedData + '.' + encryptedQuarter.key + '.' + encryptedQuarter.iv,
      Remarks: Remarks,
      Deleted: "1",
      ModifiedBy: userId,
    });

    // Return success response
    return res.status(200).send({
      status: true,
      message: "Add Production Performance Successfully",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const getAllprPerformanceData = async (req, res) => {
  const performanceData = [];
  try {
    const getAllData = await prPerformance.findAll({
      where: {
        Deleted: "1",
      },
      order: [
        ["ProductionID", "DESC"],
      ],
      attributes: [
        "ProductionID",
        "OrganisationID",
        "YearID",
        "Cumulative",
        "Quarter",
        "Remarks",
        "Deleted",
      ],
    });
    for (let i = 0; i < getAllData.length; i++) {
      if (getAllData[i].ProductionID != req.ProductionID) {
        // Decrypt the encrypted fields
        const organisationIDComponents = getAllData[i].OrganisationID.split('.');
        const yearIDComponents = getAllData[i].YearID.split('.');
        const quarterComponents = getAllData[i].Quarter.split('.');
        // Decrypt the encrypted data
        const decryptedOrganisationID = decryptData({
          encryptedData: organisationIDComponents[0],
          key: organisationIDComponents[1],
          iv: organisationIDComponents[2]
        });
        const decryptedYearID = decryptData({
          encryptedData: yearIDComponents[0],
          key: yearIDComponents[1],
          iv: yearIDComponents[2]
        });

        const decryptedquaterID = decryptData({
          encryptedData: quarterComponents[0],
          key: quarterComponents[1],
          iv: quarterComponents[2]
        });
        const dataItem = {
          ProductionID: getAllData[i].ProductionID,
          Cumulative: getAllData[i].Cumulative,
          Quarter: decryptedquaterID,
          Remarks: getAllData[i].Remarks || "",
          FYear: decryptedYearID ? await helper.getFYear(decryptedYearID) : "",
          OrganisationName: decryptedOrganisationID ? await helper.organName(decryptedOrganisationID) : "",
        };

        // Add the data item to the performance data array
        performanceData.push(dataItem);
      }
    }
    const page = parseInt(req.query.page) || 0;
    const limit = req.query.limit || 10;
    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;
    const result = {};
    result.dataItems = performanceData.slice(startIndex, endIndex);
    result.totalItems = performanceData.length;
    result.totalPage = Math.ceil(performanceData.length / limit);
    result.currentPage = page;

    if (result.dataItems.length == 0) {
      return res
        .status(200)
        .send({ status: false, message: "Data not found", data: result });
    }


    return res.status(200).json({
      status: true,
      message: "List of production performance data",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getprPerformanceById = async (req, res) => {
  try {
    const { ProductionID } = req.params;
    const performanceData = [];
    if (!ProductionID) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter ProductionID" });
    }
    const prProd = await prPerformance.findOne({
      where: {
        ProductionID: ProductionID,
      },
      attributes: [
        "ProductionID",
        "OrganisationID",
        "YearID",
        "Cumulative",
        "Quarter",
        "Remarks",
        "Deleted",
      ],
    });

    const organisationIDComponents = prProd.OrganisationID.split('.');
    const yearIDComponents = prProd.YearID.split('.');
    const quarterComponents = prProd.Quarter.split('.');
    // Decrypt the encrypted data
    const decryptedOrganisationID = decryptData({
      encryptedData: organisationIDComponents[0],
      key: organisationIDComponents[1],
      iv: organisationIDComponents[2]
    });
    const decryptedYearID = decryptData({
      encryptedData: yearIDComponents[0],
      key: yearIDComponents[1],
      iv: yearIDComponents[2]
    });

    const decryptedquaterID = decryptData({
      encryptedData: quarterComponents[0],
      key: quarterComponents[1],
      iv: quarterComponents[2]
    });

    performanceData.push({
      OrganisationID: prProd.ProductionID,
      OrganisationID: decryptedOrganisationID,
      YearID: decryptedYearID,
      Cumulative: prProd.Cumulative,
      Quarter: decryptedquaterID,
      Remarks: prProd.Remarks || "",
      Deleted: prProd.Deleted,   
      FYear: decryptedYearID ? await helper.getFYear(decryptedYearID) : "",
      OrganisationName: decryptedOrganisationID ? await helper.organName(decryptedOrganisationID) : "",
    });

    if (!prProd) {
      return res.status(404).send({
        status: false,
        message: `Data ${ProductionID} not found`,
      });
    }
    return res.status(200).send({
      status: true,
      message: "Data found Successfully",
      data: performanceData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateprPerformanceById = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const actualToken = await encryptToToken(token);
    const decodeToken = jwt.decode(actualToken);
    const userId = decodeToken.id;
    const { ProductionID } = req.params;
    console.log(ProductionID,"ProductionID$$$$")
    const { OrganisationID, Cumulative, YearID, Quarter, Remarks } = req.body;
    const OrganisationIDString = OrganisationID.toString().trim();
    const YearIDString = YearID.toString().trim();
    const QuarterString = Quarter.toString().trim();
    // Encrypt data
    const encryptedOrganisationID = encryptData(OrganisationIDString);

    const encryptedYearID = encryptData(YearIDString);
    const encryptedQuarter = encryptData(QuarterString);
console.log(encryptedOrganisationID,"---@@@--",encryptedYearID,"---@@@---",encryptedQuarter )
    await prPerformance.update(
      {
        OrganisationID: encryptedOrganisationID.encryptedData + '.' + encryptedOrganisationID.key + '.' + encryptedOrganisationID.iv,
        YearID: encryptedYearID.encryptedData + '.' + encryptedYearID.key + '.' + encryptedYearID.iv,
        Quarter: encryptedQuarter.encryptedData + '.' + encryptedQuarter.key + '.' + encryptedQuarter.iv,
        Cumulative,
        Remarks,
        ModifiedBy: userId,
      },
      { where: { ProductionID } }
    );

    return res.status(200).send({
      status: true,
      message: `Organization updated successfully`,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const deletePrProd = async (req, res) => {
  try {
    const { ProductionID } = req.params;
    await prPerformance.update(
      {
        Deleted: "0",
      },
      {
        where: {
          ProductionID: ProductionID,
        },
      }
    );

    return res
      .status(200)
      .send({ status: true, message: "Organisation deleted successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

/**************************************************** percentage & pie chart***********************************************************************/
// const countOrganisation = async (req, res) => {
//   try {
//     const countActiveOrganisation = await Organisation.count({
//       where: { Deleted: "1" },
//     });
//     if (!countActiveOrganisation) {
//       return res.status(404).json({
//         status: false,
//         message: "Organisation Count Failed",
//       });
//     }
//     return res.status(200).json({
//       status: true,
//       message: "Organisation Count Found",
//       data: countActiveOrganisation,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

/**
 * Function to Calculate percentage of organisation based on production performance
 * @param {obj} req, res, next
 * @returns {json} obj
 */
// const OrgTypePrPercentage = async (req, res) => {
//   try {
//     const orgId = req.body.orgId;
//     const countorg = await Organisation.count({
//       where: { Deleted: "1" },
//     });
//     const countOrgByName = await Organisation.count({
//       include: [
//         {
//           model: prPerformance,
//           required: true,
//           attributes: ["DPSU"],
//           as: "DPSUName",
//          // where: { DPSU: orgId },
//         },
//       ],
//       where: {
//         Deleted: "1",
//       },
//     });
//     const orgPercentage = ((countOrgByName / countorg) * 100).toFixed(2);
//     if (!orgPercentage) {
//       return res.status(404).json({
//         status: false,
//         message: `Organisation Not Found`,
//       });
//     }
//     return res.status(200).json({
//       status: true,
//       message: `Organosation Percentage Found`,
//       data: orgPercentage,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// const OrgTypePrPercentage = async (req, res) => {
//   try {
//     const orgId = req.body.orgId;
//     const countorg = await Organisation.count({
//       where: { Deleted: "1" },
//     });
//     const countOrgByName = await Organisation.count({
//       include: [
//         {
//           model: prPerformance,
//           required: true,
//           attributes: ["DPSU"],
//           as: "DPSUName",
//           where: { DPSU: orgId },
//         },
//       ],
//       where: {
//         Deleted: "1",   
//       },
//     });
//     const orgPercentage = ((countOrgByName / countorg) * 100).toFixed(2);
//     if (!orgPercentage) {
//       return res.status(404).json({
//         status: false,
//         message: `Organisation Not Found`,
//       });
//     }
//     return res.status(200).json({
//       status: true,
//       message: `Organosation Percentage Found`,
//       data: orgPercentage,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

/**
 * Function to pie chart org for production performance.
 * @param {obj} req, res, next
 * @returns {json} obj
 */
const pieChartOrganisation = async (req, res) => {
  try {
    const performanceData = [];
    const totalOrgCount = await Organisation.count({
      where: { Deleted: "1" },
    });
    let totalCumulative = await prPerformance.sum('Cumulative', {
      where: { Deleted: "1" },
    });
    const prProd = await prPerformance.findAll({
      attributes: [
        "ProductionID",
        "YearID",
        "OrganisationID",
        "Cumulative",
        "Quarter",
        "Remarks",
        "Deleted",
        [sequelize.fn("COUNT", sequelize.col("OrganisationID")), "countOrganisation"],
        [sequelize.fn("SUM", sequelize.col("Cumulative")), "SumofCumulative"],
        [sequelize.fn("AVG", sequelize.col("Cumulative")), "avgCumulative"],
      ],
      group: ["OrganisationID"],
      where: { Deleted: "1" },
    });
    for (let i = 0; i < prProd.length; i++) {
      if (prProd[i].ProductionID != req.ProductionID) {

        const organisationName = prProd[i].OrganisationID
          ? await helper.organName(prProd[i].OrganisationID)
          : "";
        const FYear = prProd[i].YearID
          ? await helper.getFYear(prProd[i].YearID)
          : "";
        performanceData.push({
          ProductionID: prProd[i].ProductionID,
          OrganisationID: prProd[i].OrganisationID,
          YearID: prProd[i].YearID,
          Cumulative: prProd[i].Cumulative,
          Quarter: prProd[i].Quarter,
          Remarks: prProd[i].Remarks || "",
          Deleted: prProd[i].Deleted,
          countOrganisation: prProd[i].dataValues.countOrganisation,
          SumofCumulative: prProd[i].dataValues.SumofCumulative,
          avgCumulative: prProd[i].dataValues.avgCumulative,
          FYear: FYear,
          OrganisationName: organisationName,
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: `Organisation Percentage Found`,
      data: { totalOrgCount, totalCumulative, performanceData },
      //data:  { totalOrgCount,percentageOrganisationByName }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
//  * Function to Count Organosation
//  * @param {obj} req, res, next
//  * @returns {json} obj
//  */
// const organisationCount = async (req, res) => {
//   try {
//     const countActiveOrganisation = await Organisation.count({
//       where: { Deleted: "1" },
//     });
//     console.log(countActiveOrganisation, "countActiveOrganisation");
//     const countOrganisation = await Organisation.findAll({
//       attributes: [
//         "Code",
//         "Name",
//         [sequelize.fn("COUNT", sequelize.col("Deleted")), "Code"],
//       ],
//       group: "Code",
//       include: [
//         {
//           model: prPerformance,
//           attributes: { exclude: ["DPSU", "	YearID"] },
//           right: true,
//           where: {
//             Deleted: "1",
//           },
//         },
//       ],
//     });
//     const deviceDashboardCount = {};
//     deviceDashboardCount.totalDeviceCount = totalDeviceCount;
//     deviceDashboardCount.totalInStockDevice = totalInStockDevice;
//     deviceDashboardCount.totalInUseDevice = totalInUseDevice;
//     deviceDashboardCount.totalChetuSideDevice = totalChetuSideDevice;
//     deviceDashboardCount.totalClientSideDevice = totalClientSideDevice;
//     return res.status(200).json({
//       status: true,
//       message: `Organisation Count Found`,
//       data: { countOrganisation, countActiveOrganisation },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

module.exports = {
  addprPerformanceData,
  getAllprPerformanceData,
  getprPerformanceById,
  updateprPerformanceById,
  deletePrProd,
  // countOrganisation,
  // OrgTypePrPercentage,
  pieChartOrganisation,
  // organisationCount,
};
