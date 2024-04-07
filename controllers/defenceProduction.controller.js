const db = require("../models");
const DefenceProduction = db.defenceProduction;
const sequelize = require("sequelize");

const { finalyear } = require("../helper/finalYear");
const moment = require("moment");
const { idIntoBase64, Base64toId } = require("../helper/idIntoBase64");
const helper = require("../helper/helper");

const adddefenceProduction = async (req, res) => {
  try {
    const {
      YearID,
      Quarter,
      DPSU,
      OFB,
      Other_PSU,
      Defence_Private_Companies,
      ModifiedOn,
    } = req.body;
    const userId = req.userId;
    await DefenceProduction.create({
      YearID: YearID,
      Quarter: Quarter,
      DPSU: DPSU,
      OFB: OFB,
      Other_PSU: Other_PSU,
      Defence_Private_Companies,
      ModifiedOn: ModifiedOn,
      ModifiedBy: userId,
    });
    return res
      .status(200)
      .send({ status: true, message: " added Defence Production sccessfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getAllDefenceProductionData = async (req, res) => {
  try {
    const productionData = [];
    const key = req.query.key;
    const production = await DefenceProduction.findAll({
      attributes: [
        "DefenceProductionID",
        "YearID",
        "Quarter",
        "DPSU",
        "Defence_Private_Companies",
        "Other_PSU",
        "OFB",
        "Deleted",
      ],
    });

    for (let i = 0; i < production.length; i++) {
      const encoded = await idIntoBase64(production[i].DefenceProductionID);
      productionData.push({
        productionId: encoded,
        YearID: finalyear(production[i].YearID),
        Quarter: production[i].Quarter || "",
        DPSU: production[i].DPSU,
        Defence_Private_Companies: production[i].Defence_Private_Companies,
        Other_PSU: production[i].Other_PSU,
        new7Company: production[i].OFB,
        status: production[i].Deleted,
      });
    }

    if (key) {
      const prodData = productionData.filter((item) => {
        return (
          item.YearID.includes(key) ||
          String(item.Quarter).includes(key) ||
          String(item.incomplete_claims_clarification_sought).includes(key) ||
          String(item.DPSU).includes(key) ||
          String(item.Defence_Private_Companies).includes(key) ||
          String(item.Other_PSU).includes(key) ||
          String(item.new7Company).includes(key)
        );
      });
      const result = {};
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = page * limit;
      const endIndex = (page + 1) * limit;
      result.dataItems = prodData.slice(startIndex, endIndex);
      result.totalItems = prodData.length;
      result.totalPage = Math.ceil(prodData.length / limit);
      result.currentPage = page;

      return res
        .status(200)
        .send({ status: true, message: "Data found", data: result });
    } else {
      const result = {};
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = page * limit;
      const endIndex = (page + 1) * limit;
      result.dataItems = productionData.slice(startIndex, endIndex);
      result.totalItems = productionData.length;
      result.totalPage = Math.ceil(productionData.length / limit);
      result.currentPage = page;
      return res
        .status(200)
        .send({ status: true, message: "Data found", data: result });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updatedefenceProduction = async (req, res) => {
  try {
    const { DefenceProductionID } = req.params;
    const actualId = await Base64toId(DefenceProductionID);
    const {
      YearID,
      Quarter,
      DPSU,
      OFB,
      Other_PSU,
      Defence_Private_Companies,
      ModifiedOn,
    } = req.body;

    const founddefenceProduction = await DefenceProduction.findByPk(actualId);

    if (!founddefenceProduction) {
      return res.status(404).send({
        status: "error",
        message: `Defence production exist`,
      });
    }

    await DefenceProduction.update(
      {
        YearID,
        Quarter,
        DPSU,
        OFB,
        Other_PSU,
        Defence_Private_Companies,
        ModifiedOn,
      },
      { where: { actualId } }
    );

    return res.status(200).send({
      status: true,
      message: `Derfence Production updated successfully`,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getByIddefenceProduction = async (req, res) => {
  try {
    const { DefenceProductionID } = req.params;
    const actualId = await Base64toId(DefenceProductionID);
    const foundDefenceProduction = await DefenceProduction.findByPk(actualId, {
      attributes: [
        "YearID",
        "Quarter",
        "DPSU",
        "OFB",
        "Other_PSU",
        "Defence_Private_Companies",
        "ModifiedOn",
      ],
    });

    if (!foundDefenceProduction) {
      return res.status(404).send({
        status: false,
        message: `Data not found`,
      });
    }
    const productionData = {
      YearID: foundDefenceProduction.YearID,
      Quarter: foundDefenceProduction.Quarter || "",
      DPSU: foundDefenceProduction.DPSU,
      OFB: foundDefenceProduction.OFB,
      Other_PSU: foundDefenceProduction.Other_PSU,
      Defence_Private_Companies:
        foundDefenceProduction.Defence_Private_Companies,
      ModifiedOn: moment(
        foundDefenceProduction.ModifiedOn,
        "YYYY-MM-DD"
      ).format("MM/DD/YYYY"),
    };
    return res.status(200).send({
      status: true,
      message: "Data found successfully",
      data: productionData,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const deletedefenceProduction = async (req, res) => {
  try {
    const { DefenceProductionID } = req.params;
    const actualId = await Base64toId(DefenceProductionID);

    const status = req.query.status;
    if (!status) {
      return res
        .status(400)
        .send({ status: true, message: "Please enter status" });
    }

    if (status == "1") {
      await DefenceProduction.update(
        {
          Deleted: status,
        },
        {
          where: {
            DefenceProductionID: actualId,
          },
        }
      );

      return res.status(200).send({
        status: true,
        message: "DefenceProduction inActive successfully",
      });
    } else {
      await DefenceProduction.update(
        {
          Deleted: status,
        },
        {
          where: {
            DefenceProductionID: actualId,
          },
        }
      );

      return res.status(200).send({
        status: true,
        message: "DefenceProduction active successfully",
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const getdefenceProductionData = async (req, res) => {
  try {
    const foundDefenceProduction = await DefenceProduction.findOne({
      attributes: [
        "YearID",
        "Quarter",
        "DPSU",
        "OFB",
        "Other_PSU",
        "Defence_Private_Companies",
        "ModifiedOn",
      ],
      order: [["ModifiedOn", "DESC"]],
    });

    if (!foundDefenceProduction) {
      return res.status(404).send({
        status: false,
        message: `Data not found`,
      });
    }
    const productionData = {
      YearID: finalyear(foundDefenceProduction.YearID),
      totalValue:
        foundDefenceProduction.DPSU +
        foundDefenceProduction.OFB +
        foundDefenceProduction.Other_PSU +
        foundDefenceProduction.Defence_Private_Companies,
      ModifiedOn: moment(
        foundDefenceProduction.ModifiedOn,
        "YYYY-MM-DD"
      ).format("MM/DD/YYYY"),
    };
    return res.status(200).send({
      status: true,
      message: "Data found successfully",
      data: productionData,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
const getPercentDefenceProductionData = async (req, res) => {
  try {
    const productionData = [];
    const production = await DefenceProduction.findAll({
      attributes: [
        "DefenceProductionID",
        "YearID",
        "Quarter",
        "DPSU",
        "Defence_Private_Companies",
        "Other_PSU",
        "OFB",
        "Deleted",
      ],
    });

    const asOnDate = await DefenceProduction.findOne({
      attributes: ["ModifiedOn", "DPSU"],
      order: [["DefenceProductionID", "DESC"]],
    });

    const desiredAttributes = [
      "DPSU",
      "OFB",
      "Other_PSU",
      "Defence_Private_Companies",
    ];

    const allAttributes = Object.keys(DefenceProduction.rawAttributes);

    const companiesdata = allAttributes.filter((attribute) =>
      desiredAttributes.includes(attribute)
    );

    console.log(companiesdata);

    for (let i = 0; i < production.length; i++) {
      productionData.push({
        YearID: production[i].YearID
          ? await helper.getFYear(production[i].YearID)
          : "",
        Quarter: production[i].Quarter || "",
        DPSU: parseFloat(production[i].DPSU + production[i].OFB).toFixed(2),
        Defence_Private_Companies: production[i].Defence_Private_Companies,
        Other_PSU: production[i].Other_PSU,
        new7Company: production[i].OFB,
      });
    }

    const defenceProdData = {
      productionData,
      ModifiedOn: moment(asOnDate.dataValues.ModifiedOn, "YYYY-MM-DD").format(
        "MM/DD/YYYY"
      ),
      companiesdata,
    };

    return res.status(200).send({
      status: true,
      message: "Data found successfully",
      data: defenceProdData,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const getAllLastUpadtedefenceProduction = async (req, res) => {
  try {
    const lastResult = [];
    const lUpdateData = await DefenceProduction.findAll({
      attributes: [
        "DefenceProductionID",
        "YearID",
        "Quarter",
        "DPSU",
        "Defence_Private_Companies",
        "Other_PSU",
        "OFB",
        "Deleted",
      ],
    });
    for (let i = 0; i < lUpdateData.length; i++) {
      lastResult.push({
        year: lUpdateData[i].YearID
          ? await helper.getFYear(lUpdateData[i].YearID)
          : "",
        defencePublicSector: lUpdateData[i].DPSU,
        OFB: lUpdateData[i].OFB,
        Other_PSU: lUpdateData[i].Other_PSU,
        Defence_Private_Companies: lUpdateData[i].Defence_Private_Companies,
        totalExport: parseFloat(
          lUpdateData[i].DPSU +
            lUpdateData[i].OFB +
            lUpdateData[i].Other_PSU +
            lUpdateData[i].Defence_Private_Companies
        ).toFixed(2),
      });
    }

    return res.status(200).send({
      status: true,
      message: "data found ",
      data: lastResult,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const pieChartDefenceProd = async (req, res) => {
  try {
    const defenceProdData = [];
    const defenceProd = await DefenceProduction.findAll({
      attributes: [
        "DefenceProductionID",
        "YearID",
        "Quarter",
        "DPSU",
        "Defence_Private_Companies",
        "Other_PSU",
        "OFB",
        "Deleted",
        [sequelize.fn("AVG", sequelize.col("Other_PSU")), "avgPSU"],
        [
          sequelize.fn("AVG", sequelize.col("Defence_Private_Companies")),
          "avgPrivate",
        ],
      ],
      where: { YearID: "8" },
    });
    console.log(defenceProd, "defenceProd");
    for (let i = 0; i < defenceProd.length; i++) {
      if (defenceProd[i].DefenceProductionID != req.DefenceProductionID) {
        defenceProdData.push({
          totalExport: parseFloat(
            defenceProd[i].DPSU +
              defenceProd[i].OFB +
              defenceProd[i].Other_PSU +
              defenceProd[i].Defence_Private_Companies
          ).toFixed(2),
          AvgDpsuOfb: parseFloat(
            defenceProd[i].DPSU + defenceProd[i].OFB
          ).toFixed(2),
          avgPSU: defenceProd[i].dataValues.avgPSU,
          avgPrivate: defenceProd[i].dataValues.avgPrivate,
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: `Organisation Percentage Found`,
      data: {
        defenceProdData,
      } /*  calculate in front end  percentage= (33777 /46175) * 100   = 73.1499729291  */,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
module.exports = {
  getAllDefenceProductionData,
  adddefenceProduction,
  updatedefenceProduction,
  getByIddefenceProduction,
  deletedefenceProduction,
  getdefenceProductionData,
  getPercentDefenceProductionData,
  getAllLastUpadtedefenceProduction,
  pieChartDefenceProd,
};
