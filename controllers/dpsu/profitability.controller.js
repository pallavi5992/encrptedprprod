const db = require("../../models");
const sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const helper = require("../../helper/helper");
const jwt = require("jsonwebtoken");
const profitability = db.profitability;
const Organisation = db.organisation;
const FyYear = db.tblYear;
const getPreviousFinancialYear = async (selectedYear) => {
  const FyYearExist = await FyYear.findOne({
    where: {
      YearID: selectedYear,
    },
  });

  // Extract the year portion from the selected year string
  const selectedYearParts = FyYearExist.Year.split("-");
  const selectedStartYear = parseInt(selectedYearParts[0]);

  // Calculate the previous financial year
  const previousYear = selectedStartYear - 1;
  const previousFinancialYear = `${previousYear}-${selectedStartYear}`;

  return previousFinancialYear;
};
const addprofitabilityData = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const actualToken=await encryptToToken(token);
    const decodeToken = jwt.decode(actualToken);
    const userId = decodeToken.id;
    const { OrganisationID, Amount, FyYearID, Quarter, Remarks } = req.body;
    const validPreviousFyYear = await getPreviousFinancialYear(FyYearID);
    if (validPreviousFyYear) {
      const PreviousFY = await FyYear.findOne({
        where: {
          Year: validPreviousFyYear,
        },
      });
      if (!PreviousFY) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid Previous Financial Year" });
      }
      await profitability.create({
        OrganisationID: OrganisationID,
        Amount: Amount,
        YearID: FyYearID,
        PreviousFY: PreviousFY.Year,
        Quarter: Quarter,
        Remarks: Remarks,
        Deleted: "1",
        ModifiedBy: userId,
      });
      return res.status(200).send({
        status: true,
        message: "Profitability Data Added Successfully",
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const getAllProfitabilityData = async (req, res) => {
  try {
    const profitabilityData = [];
    const getAllData = await profitability.findAll({
      where: {
        Deleted: "1",
      },
      order: [
        ["ProfitabilityID", "DESC"], // Sorts by COLUMN in ascending order
      ],
      attributes: [
        "ProfitabilityID",
        "OrganisationID",
        "Amount",
        "YearID",
        "PreviousFY",
        "Quarter",
        "Remarks",
        "Deleted",
      ],
    });
    for (let i = 0; i < getAllData.length; i++) {
      if (getAllData[i].ProfitabilityID != req.ProfitabilityID) {
        profitabilityData.push({
          ProfitabilityID: getAllData[i].ProfitabilityID,
          YearID: getAllData[i].YearID,
          
          OrganisationID: getAllData[i].OrganisationID,
          Amount: getAllData[i].Amount, 
          FYear: getAllData[i].YearID
            ? await helper.getFYear(getAllData[i].YearID)
            : "",
          PreviousFY:getAllData[i].PreviousFY,
          Quarter: getAllData[i].Quarter,
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
    result.dataItems = profitabilityData.slice(startIndex, endIndex);
    result.totalItems = profitabilityData.length;
    result.totalPage = Math.ceil(profitabilityData.length / limit);
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
        message: "List of profitability data",
        data: result,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getProfitabilityById = async (req, res) => {
  try {
    const { ProfitabilityID } = req.params;
    const profitData = [];
    if (!ProfitabilityID) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter ProfitabilityID" });
    }
    const profitabilityExsist = await profitability.findOne({
      where: {
        ProfitabilityID: ProfitabilityID,
      },
      attributes: [
        "ProfitabilityID",
        "OrganisationID",
        "Amount",
        "YearID",
        "PreviousFY",
        "Quarter",
        "Remarks",
      ],
    });
    profitData.push({
      ProfitabilityID: profitabilityExsist.ProfitabilityID,
      OrganisationID: profitabilityExsist.OrganisationID,
      YearID: profitabilityExsist.YearID,
      PreviousFY: profitabilityExsist.PreviousFY,
      Amount: profitabilityExsist.Amount,
      Quarter: profitabilityExsist.Quarter,
      Remarks: profitabilityExsist.Remarks || "",
      FYear: profitabilityExsist.YearID
        ? await helper.getFYear(profitabilityExsist.YearID)
        : "",
      OrganisationName: profitabilityExsist.OrganisationID
        ? await helper.organName(profitabilityExsist.OrganisationID)
        : "",
    });
    if (!profitabilityExsist) {
      return res.status(404).send({
        status: false,
        message: `Data ${profitabilityExsist} not found`,
      });
    }
    return res.status(200).send({
      status: true,
      message: "Data found Successfully",
      data: profitData,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const updateProfitabilityById = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const actualToken=await encryptToToken(token);
    const decodeToken = jwt.decode(actualToken);
    const userId = decodeToken.id;
    const { ProfitabilityID } = req.params;
    const { OrganisationID, Amount, YearID, Quarter, Remarks } = req.body;
    if (!ProfitabilityID) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter ProfitabilityID" });
    }
    const profitabilityExsist = await profitability.findOne({
      where: {
        ProfitabilityID: ProfitabilityID,
      },
    });
    if (!profitabilityExsist) {
      return res.status(404).send({
        status: false,
        message: `Data ${ProfitabilityID} not found`,
      });
    }
    if (YearID) {
      const validPreviousFyYear = await getPreviousFinancialYear(YearID);
      if (validPreviousFyYear) {
        const PrevFY = await FyYear.findOne({
          where: {
            Year: validPreviousFyYear,
          },
        });
        if (!PrevFY) {
          return res
            .status(400)
            .send({
              status: false,
              message: "Invalid Previous Financial Year",
            });
        }
        PreviousFY = PrevFY.Year;

        await profitability.update(
          {
            OrganisationID,
            Amount,
            YearID,
            PreviousFY,
            Quarter,
            Remarks,
            ModifiedBy: userId,
          },
          { where: { ProfitabilityID } }
        );
      }
    }

    return res.status(200).send({
      status: true,
      message: `Profitability updated successfully`,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const deleteProfitabilityById = async (req, res) => {
  try {
    const { ProfitabilityID } = req.params;
    if (!ProfitabilityID) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter ProfitabilityID" });
    }
    const profitabilityExsist = await profitability.findOne({
      where: {
        ProfitabilityID: ProfitabilityID,
      },
    });
    if (!profitabilityExsist) {
      return res.status(404).send({
        status: false,
        message: `Data ${ProfitabilityID} not found`,
      });
    }
    await profitability.update(
      { Deleted: "0" },
      { where: { ProfitabilityID: ProfitabilityID } }
    );
    return res
      .status(200)
      .send({ status: true, message: "Order Book deleted successfully" });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const pieChartProfit = async (req, res) => {
  try {
    const profitData = [];
    const totalOrgCount = await profitability.count({
      where: { Deleted: "1" },
    });
    let totalAmount = await profitability.sum('Amount',{
    where: { Deleted: "1" },
    });  
    const profitabilityData = await profitability.findAll({  
      attributes: [
        "ProfitabilityID",
        "OrganisationID",
        "Amount",
        "YearID",
        "PreviousFY",
        "Quarter",
        "Remarks",
        [sequelize.fn("COUNT", sequelize.col("OrganisationID")), "countOrganisation"],
        [sequelize.fn("SUM", sequelize.col("Amount")), "sumOfAmnt"],
        [sequelize.fn("AVG", sequelize.col("Amount")), "avgOfAmnt"],
      ],
      group: ["OrganisationID"], 
      where: { Deleted: "1" },   
    });
    for (let i = 0; i < profitabilityData.length; i++) {   
      if (profitabilityData[i].ProfitabilityID != req.ProfitabilityID) {
        
        const organisationName = profitabilityData[i].OrganisationID
          ? await helper.organName(profitabilityData[i].OrganisationID)
          : "";
          const FYear = profitabilityData[i].YearID
          ? await helper.getFYear(profitabilityData[i].YearID)                                     
          : "";
          profitData.push({
          ProfitabilityID: profitabilityData[i].ProfitabilityID,
          OrganisationID: profitabilityData[i].OrganisationID,
          Amount: profitabilityData[i].Amount,
          YearID: profitabilityData[i].YearID,
          Quarter: profitabilityData[i].formattedSelectedMonth,
          Remarks: profitabilityData[i].Remarks || "",
          Deleted: profitabilityData[i].Deleted,
          countOrganisation: profitabilityData[i].dataValues.countOrganisation,
          sumOfAmnt:profitabilityData[i].dataValues.sumOfAmnt,
          avgOfAmnt: profitabilityData[i].dataValues.avgOfAmnt,
          FYear: FYear,
          OrganisationName: organisationName
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: `Profitability Percentage Found`,
      data: { totalOrgCount, totalAmount, profitData },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
module.exports = {
  addprofitabilityData,
  getAllProfitabilityData,
  getProfitabilityById,
  updateProfitabilityById,
  deleteProfitabilityById,
  pieChartProfit   
};
