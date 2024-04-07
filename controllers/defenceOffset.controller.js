const db = require("../models");
const DefenceOffsetOffline = db.defenceoffsetOffine;
const DefenceOffsetOnline = db.defenceoffsetOnline;
const DefenceOffsetYearly = db.defenceoffsetYearlydata;
const { getSystemIPAddress } = require("../helper/systemIp");

const { Op } = require("sequelize");
const axios = require("axios");
const moment = require("moment");

const addDefenceOffsetOfflinedata = async (req, res) => {
  try {
    const { dataStatus } = req.params;
    const response = await axios.get(
      `https://domw.gov.in/Dashboardfilterclaim/getDatacontract/DOMWMODsupport1/${dataStatus}`
    );

    if (response.status === 200) {
      const model1 = response.data;
      const existingRecords = await DefenceOffsetOffline.findAll({
        where: { dataStatus: dataStatus },
      });

      for (const item of existingRecords) {
        await DefenceOffsetOffline.destroy({
          where: {
            contract_description: item.contract_description,
          },
        });
      }

      const createdRecords = [];

      if (model1.result.data.length > 1) {
        for (const item of model1.result.data) {
          const data = await DefenceOffsetOffline.create({
            contractid: item.contractid,
            oem_name: item.oem_name,
            contract_short: item.contract_short,
            contract_description: item.contract_description,
            claims_submitted_cgda: parseFloat(item.claims_submitted_cgda),
            incomplete_claims_clarification_sought: parseFloat(
              item.incomplete_claims_clarification_sought
            ),
            under_examination_by_domw: parseFloat(
              item.under_examination_by_domw
            ),
            under_examination_by_cgda: parseFloat(
              item.under_examination_by_cgda
            ),
            claims_verified: parseFloat(item.claims_verified),
            claims_rejected: parseFloat(item.claims_rejected),
            claim_rejected_by_domw: parseFloat(item.claim_rejected_by_domw),
            DataStatus: dataStatus,
            ModifiedBy: 1,
            ModifiedOn: new Date(),
            IPAddress: getSystemIPAddress(),
          });
          createdRecords.push(data);
        }

        return res
          .status(200)
          .send({ status: true, message: "Data Updated Successfully" });
      } else {
        return res.status(200).send("No Records Found");
      }
    } else {
      return res.status(500).send("Something Went Wrong");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const getAllDefenceOffsetOffineData = async (req, res) => {
  try {
    const OfflineData = [];
    const offsetOfflineData = await DefenceOffsetOffline.findAll({
      attributes: [
        "contract_short",
        "claims_submitted_cgda",
        "incomplete_claims_clarification_sought",
        "under_examination_by_domw",
        "under_examination_by_cgda",
        "claims_verified",
        "claims_rejected",
        "claim_rejected_by_domw",
      ],
    });

    for (let i = 0; i < offsetOfflineData.length; i++) {
      OfflineData.push({
        contract_short: offsetOfflineData[i].contract_short,
        claims_submitted_cgda: offsetOfflineData[i].claims_submitted_cgda,
        incomplete_claims_clarification_sought:
          offsetOfflineData[i].incomplete_claims_clarification_sought,
        Complete_Claims_Submitted_to_CGDA: parseFloat(
          offsetOfflineData[i].claims_submitted_cgda -
            offsetOfflineData[i].incomplete_claims_clarification_sought
        ).toFixed(2),
        under_examination_by_domw:
          offsetOfflineData[i].under_examination_by_domw,
        under_examination_by_cgda:
          offsetOfflineData[i].under_examination_by_cgda,
        claims_verified: offsetOfflineData[i].claims_verified,
        claims_rejected: offsetOfflineData[i].claims_rejected,
        claim_rejected_by_domw: offsetOfflineData[i].claim_rejected_by_domw,
      });
    }

    const page = parseInt(req.query.page) || 0;
    const limit = req.query.limit || 10;
    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;
    const result = {};
    result.dataItems = OfflineData.slice(startIndex, endIndex);
    result.totalItems = OfflineData.length;
    result.totalPage = Math.ceil(OfflineData.length / limit);
    result.currentPage = page;

    return res
      .status(200)
      .send({ status: true, message: "Data found", data: result });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const searchDefenceOffsetOfflinedata = async (req, res) => {
  try {
    const { key } = req.params;

    const OfflineData = [];
    const allData = await DefenceOffsetOffline.findAll({
      attributes: [
        "contract_short",
        "claims_submitted_cgda",
        "incomplete_claims_clarification_sought",
        "under_examination_by_domw",
        "under_examination_by_cgda",
        "claims_verified",
        "claims_rejected",
        "claim_rejected_by_domw",
      ],
    });

    const offsetOfflineData = allData.filter((item) => {
      return (
        item.contract_short.includes(key) ||
        String(item.claims_submitted_cgda).includes(key) ||
        String(item.incomplete_claims_clarification_sought).includes(key) ||
        String(item.under_examination_by_domw).includes(key) ||
        String(item.under_examination_by_cgda).includes(key) ||
        String(item.claims_verified).includes(key) ||
        String(item.claims_rejected).includes(key) ||
        String(item.claim_rejected_by_domw).includes(key)
      );
    });
    for (let i = 0; i < offsetOfflineData.length; i++) {
      OfflineData.push({
        contract_short: offsetOfflineData[i].contract_short,
        claims_submitted_cgda: offsetOfflineData[i].claims_submitted_cgda,
        incomplete_claims_clarification_sought:
          offsetOfflineData[i].incomplete_claims_clarification_sought,
        Complete_Claims_Submitted_to_CGDA: parseFloat(
          offsetOfflineData[i].claims_submitted_cgda -
            offsetOfflineData[i].incomplete_claims_clarification_sought
        ).toFixed(2),
        under_examination_by_domw:
          offsetOfflineData[i].under_examination_by_domw,
        under_examination_by_cgda:
          offsetOfflineData[i].under_examination_by_cgda,
        claims_verified: offsetOfflineData[i].claims_verified,
        claims_rejected: offsetOfflineData[i].claims_rejected,
        claim_rejected_by_domw: offsetOfflineData[i].claim_rejected_by_domw,
      });
    }

    return res.status(200).send({ status: true, data: OfflineData });
  } catch (error) {
    return res.status(500).send({ status: false, messasge: error.message });
  }
};

const addDefenceOffsetOnlinedata = async (req, res) => {
  try {
    // const { dataStatus, ip } = req.params;
    const response = await axios.get(
      `https://domw.gov.in/Dashboardfilterclaim/getDatacontract/DOMWMODsupport1/online`
    );

    if (response.status === 200) {
      const model1 = response.data;
      const existingRecords = await DefenceOffsetOnline.findAll({
        where: { dataStatus: "online" },
      });

      for (const item of existingRecords) {
        await DefenceOffsetOnline.destroy({
          where: {
            contract_description: item.contract_description,
          },
        });
      }

      const createdRecords = [];

      if (model1.result.data.length > 1) {
        for (const item of model1.result.data) {
          const data = await DefenceOffsetOnline.create({
            contractid: item.contractid,
            oem_name: item.oem_name,
            contract_short: item.contract_short,
            contract_description: item.contract_description,
            claims_submitted_cgda: parseFloat(item.claims_submitted_cgda),
            incomplete_claims_clarification_sought: parseFloat(
              item.incomplete_claims_clarification_sought
            ),
            under_examination_by_domw: parseFloat(
              item.under_examination_by_domw
            ),
            under_examination_by_cgda: parseFloat(
              item.under_examination_by_cgda
            ),
            claims_verified: parseFloat(item.claims_verified),
            claims_rejected: parseFloat(item.claims_rejected),
            claim_rejected_by_domw: parseFloat(item.claim_rejected_by_domw),
            DataStatus: "online",
            ModifiedBy: 1,
            ModifiedOn: new Date(),
            IPAddress: "",
          });
          createdRecords.push(data);
        }

        return res
          .status(200)
          .send({ status: true, message: "Data Updated Successfully" });
      } else {
        return res.status(200).send("No Records Found");
      }
    } else {
      return res.status(400).send("Something Went Wrong");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getAllDefenceOffsetOnlineData = async (req, res) => {
  try {
    const OnlineData = [];
    const offsetOnlineData = await DefenceOffsetOnline.findAll({
      attributes: [
        "contract_short",
        "claims_submitted_cgda",
        "incomplete_claims_clarification_sought",
        "under_examination_by_domw",
        "under_examination_by_cgda",
        "claims_verified",
        "claims_rejected",
        "claim_rejected_by_domw",
      ],
    });

    for (let i = 0; i < offsetOnlineData.length; i++) {
      OnlineData.push({
        contract_short: offsetOnlineData[i].contract_short,
        claims_submitted_cgda: offsetOnlineData[i].claims_submitted_cgda,
        incomplete_claims_clarification_sought:
          offsetOnlineData[i].incomplete_claims_clarification_sought,
        Complete_Claims_Submitted_to_CGDA: parseFloat(
          offsetOnlineData[i].claims_submitted_cgda -
            offsetOnlineData[i].incomplete_claims_clarification_sought
        ).toFixed(2),
        under_examination_by_domw:
          offsetOnlineData[i].under_examination_by_domw,
        under_examination_by_cgda:
          offsetOnlineData[i].under_examination_by_cgda,
        claims_verified: offsetOnlineData[i].claims_verified,
        claims_rejected: offsetOnlineData[i].claims_rejected,
        claim_rejected_by_domw: offsetOnlineData[i].claim_rejected_by_domw,
      });
    }

    const page = parseInt(req.query.page) || 0;
    const limit = req.query.limit || 10;
    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;
    const result = {};
    result.dataItems = OnlineData.slice(startIndex, endIndex);
    result.totalItems = OnlineData.length;
    result.totalPage = Math.ceil(OnlineData.length / limit);
    result.currentPage = page;

    return res
      .status(200)
      .send({ status: true, message: "Data found", data: result });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const searchDefenceOffsetOnline = async (req, res) => {
  try {
    const { key } = req.params;
    const OnlineData = [];
    const allData = await DefenceOffsetOnline.findAll({
      attributes: [
        "contract_short",
        "claims_submitted_cgda",
        "incomplete_claims_clarification_sought",
        "under_examination_by_domw",
        "under_examination_by_cgda",
        "claims_verified",
        "claims_rejected",
        "claim_rejected_by_domw",
      ],
    });

    const offsetOnlineData = allData.filter((item) => {
      return (
        item.contract_short.includes(key) ||
        String(item.claims_submitted_cgda).includes(key) ||
        String(item.incomplete_claims_clarification_sought).includes(key) ||
        String(item.under_examination_by_domw).includes(key) ||
        String(item.under_examination_by_cgda).includes(key) ||
        String(item.claims_verified).includes(key) ||
        String(item.claims_rejected).includes(key) ||
        String(item.claim_rejected_by_domw).includes(key)
      );
    });

    for (let i = 0; i < offsetOnlineData.length; i++) {
      OnlineData.push({
        contract_short: offsetOnlineData[i].contract_short,
        claims_submitted_cgda: offsetOnlineData[i].claims_submitted_cgda,
        incomplete_claims_clarification_sought:
          offsetOnlineData[i].incomplete_claims_clarification_sought,
        Complete_Claims_Submitted_to_CGDA: parseFloat(
          offsetOnlineData[i].claims_submitted_cgda -
            offsetOnlineData[i].incomplete_claims_clarification_sought
        ).toFixed(2),
        under_examination_by_domw:
          offsetOnlineData[i].under_examination_by_domw,
        under_examination_by_cgda:
          offsetOnlineData[i].under_examination_by_cgda,
        claims_verified: offsetOnlineData[i].claims_verified,
        claims_rejected: offsetOnlineData[i].claims_rejected,
        claim_rejected_by_domw: offsetOnlineData[i].claim_rejected_by_domw,
      });
    }
    
    return res.status(200).send({ status: true, data: OnlineData });
  } catch (error) {
    return res.status(500).send({ status: false, messasge: error.message });
  }
};

// Yearly Data
// const DefenceOffSetYearlyDadta = async (req, res) => {
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   try {
//     const currentdate = new Date().toJSON().slice(0, 10);

//     const response = await axios.get(
//       `https://domw.gov.in/Dashboardfilterclaim/getDataByMonth/DOMWMODsupport1/${currentdate}`
//     );

//     if (response.status === 200) {
//       const model1 = response.data;

//       if (model1) {
//         const CurrYear = new Date().getFullYear().toString();
//         const _asonDate = `As on ${new Date().getDate()} ${
//           months[new Date().getMonth()]
//         } ${CurrYear}`;

//         const lastYearDate = new Date();
//         lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
//         await DefenceOffsetYearly.destroy({
//           where: {
//             YearID: { [Op.lt]: lastYearDate },
//           },
//         });

//         const [createdRecord] = await DefenceOffsetYearly.bulkCreate([
//           {
//             YearID: 8,
//             Year: _asonDate,
//             claims_submitted_cgda: parseFloat(
//               model1.result.claims_submitted_cgda
//             ),
//             incomplete_claims_clarification_sought: parseFloat(
//               model1.result.incomplete_claims_clarification_sought
//             ),
//             under_examination_by_domw: parseFloat(
//               model1.result.under_examination_by_domw
//             ),
//             under_examination_by_cgda: parseFloat(
//               model1.result.under_examination_by_cgda
//             ),
//             claims_verified: parseFloat(model1.result.claims_verified),
//             claims_rejected: parseFloat(model1.result.claims_rejected),
//             offsets_obligation: parseFloat(model1.result.offsets_obligation),
//             claim_rejected_by_domw: parseFloat(
//               model1.result.claim_rejected_by_domw
//             ),
//           },
//         ]);
//         return res.status(200).send({
//           status: true,
//           message: "Updated Successfully",
//           data: createdRecord,
//         });
//       } else {
//         return res.status(200).send("No Records Found");
//       }
//     } else {
//       return res.status(500).send("No Records Found");
//     }
//   } catch (error) {
//     console.error("Error:", error.message);
//     return res.status(500).send(error.message);
//   }
// };
const DefenceOffSetYearlyData = async (req, res) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  try {
    const currentdate = new Date().toJSON().slice(0, 10);

    const response = await axios.get(
      `https://domw.gov.in/Dashboardfilterclaim/getDataByMonth/DOMWMODsupport1/${currentdate}`
    );

    if (response.status === 200) {
      const model1 = response.data;

      if (model1) {
        const CurrYear = new Date().getFullYear().toString();
        const _asonDate = `As on ${new Date().getDate()} ${
          months[new Date().getMonth()]
        } ${CurrYear}`;

        // Find existing record for the current year
        const existingRecord = await DefenceOffsetYearly.findOne({
          where: { YearID: CurrYear },
        });

        if (existingRecord) {
          // Update existing record
          await existingRecord.update({
            Year: _asonDate,
            claims_submitted_cgda: parseFloat(model1.result.claims_submitted_cgda),
            incomplete_claims_clarification_sought: parseFloat(
              model1.result.incomplete_claims_clarification_sought
            ),
            under_examination_by_domw: parseFloat(model1.result.under_examination_by_domw),
            under_examination_by_cgda: parseFloat(model1.result.under_examination_by_cgda),
            claims_verified: parseFloat(model1.result.claims_verified),
            claims_rejected: parseFloat(model1.result.claims_rejected),
            offsets_obligation: parseFloat(model1.result.offsets_obligation),
            claim_rejected_by_domw: parseFloat(model1.result.claim_rejected_by_domw),
          });

          return res.status(200).send({
            status: true,
            message: "Updated Successfully",
            data: existingRecord,
          });
        } else {
          // Create new record
          const createdRecord = await DefenceOffsetYearly.create({
            YearID: CurrYear,
            Year: _asonDate,
            claims_submitted_cgda: parseFloat(model1.result.claims_submitted_cgda),
            incomplete_claims_clarification_sought: parseFloat(
              model1.result.incomplete_claims_clarification_sought
            ),
            under_examination_by_domw: parseFloat(model1.result.under_examination_by_domw),
            under_examination_by_cgda: parseFloat(model1.result.under_examination_by_cgda),
            claims_verified: parseFloat(model1.result.claims_verified),
            claims_rejected: parseFloat(model1.result.claims_rejected),
            offsets_obligation: parseFloat(model1.result.offsets_obligation),
            claim_rejected_by_domw: parseFloat(model1.result.claim_rejected_by_domw),
          });

          return res.status(200).send({
            status: true,
            message: "Created Successfully",
            data: createdRecord,
          });
        }
      } else {
        return res.status(200).send("No Records Found");
      }
    } else {
      return res.status(500).send("No Records Found");
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send(error.message);
  }
};

const getDefenceOffsetYearlyData = async (req, res) => {
  try {
    const OfflineData = [];
    const offsetyearlyData = await DefenceOffsetYearly.findAll({
      attributes: [
        "Year",
        "claims_submitted_cgda",
        "incomplete_claims_clarification_sought",
        "under_examination_by_domw",
        "under_examination_by_cgda",
        "claims_verified",
        "claims_rejected",
        "claim_rejected_by_domw",
      ],
    });

    for (let i = 0; i < offsetyearlyData.length; i++) {
      OfflineData.push({
        Year: offsetyearlyData[i].Year,
        claims_submitted_cgda: offsetyearlyData[i].claims_submitted_cgda,
        incomplete_claims_clarification_sought:
          offsetyearlyData[i].incomplete_claims_clarification_sought,
        Complete_Claims_Submitted_to_CGDA:
          offsetyearlyData[i].claims_submitted_cgda -
          offsetyearlyData[i].incomplete_claims_clarification_sought,
        under_examination_by_domw:
          offsetyearlyData[i].under_examination_by_domw,
        under_examination_by_cgda:
          offsetyearlyData[i].under_examination_by_cgda,
        claims_verified: offsetyearlyData[i].claims_verified,
        claims_rejected: offsetyearlyData[i].claims_rejected,
        claim_rejected_by_domw: offsetyearlyData[i].claim_rejected_by_domw,
      });
    }

    const page = parseInt(req.query.page) || 0;
    const limit = req.query.limit || 10;
    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;
    const result = {};
    result.dataItems = OfflineData.slice(startIndex, endIndex);
    result.totalItems = OfflineData.length;
    result.totalPage = Math.ceil(OfflineData.length / limit);
    result.currentPage = page;

    return res
      .status(200)
      .send({ status: true, message: "Data found", data: result });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const searchDefenceOffsetYearlyData = async (req, res) => {
  try {
    const { key } = req.params;

    const allData = await DefenceOffsetYearly.findAll({
      attributes: [
        "Year",
        "claims_submitted_cgda",
        "incomplete_claims_clarification_sought",
        "under_examination_by_domw",
        "under_examination_by_cgda",
        "claims_verified",
        "claims_rejected",
        "claim_rejected_by_domw",
      ],
    });

    const filteredData = allData.filter((item) => {
      return (
        String(item.Year).includes(key) ||
        String(item.claims_submitted_cgda).includes(key) ||
        String(item.incomplete_claims_clarification_sought).includes(key) ||
        String(item.under_examination_by_domw).includes(key) ||
        String(item.under_examination_by_cgda).includes(key) ||
        String(item.claims_verified).includes(key) ||
        String(item.claims_rejected).includes(key) ||
        String(item.claim_rejected_by_domw).includes(key)
      );
    });

    return res.status(200).send({ status: true, data: filteredData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const offsetDataForDashboard = async (req, res) => {
  try {
    const offsetDataYaerly = await DefenceOffsetYearly.findOne({
      attributes: [
        "claims_submitted_cgda",
        "incomplete_claims_clarification_sought",
        "under_examination_by_domw",
        "under_examination_by_cgda",
        "claims_rejected",
        "claim_rejected_by_domw",
        "offsets_obligation",
        "Year",
      ],
      order: [["YearID", "DESC"]],
    });
    const dateformate = offsetDataYaerly?.Year.split("As on ")[1];

    const finalData = {
      Claims_Submitted: offsetDataYaerly.claims_submitted_cgda,
      Claims_Disposed: parseFloat(
        offsetDataYaerly.claims_submitted_cgda -
          (offsetDataYaerly.incomplete_claims_clarification_sought +
            offsetDataYaerly.under_examination_by_domw +
            offsetDataYaerly.under_examination_by_cgda +
            offsetDataYaerly.claims_rejected +
            offsetDataYaerly.claim_rejected_by_domw)
      ).toFixed(2),
      Offset_Obligation: offsetDataYaerly.offsets_obligation,
      date: moment(dateformate, "Do MMM YY").format("DD/MM/YYYY"),
    };
    return res
      .status(200)
      .send({ status: false, message: "Data found", data: finalData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const offsetPublicGraphDataGet = async (req, res) => {
  try {
    const data = [];
    const offsetDataYaerly = await DefenceOffsetYearly.findAll({
      attributes: [
        "claims_submitted_cgda",
        "incomplete_claims_clarification_sought",
        "under_examination_by_domw",
        "under_examination_by_cgda",
        "claims_rejected",
        "claim_rejected_by_domw",
        "under_examination_by_cgda",
        "Year",
      ],
    });

    for (let i = 0; i < offsetDataYaerly.length; i++) {
      data.push({
        Year: offsetDataYaerly[i].Year,
        Disposed: parseFloat(
          offsetDataYaerly[i].claims_submitted_cgda -
            (offsetDataYaerly[i].incomplete_claims_clarification_sought +
              offsetDataYaerly[i].under_examination_by_domw +
              offsetDataYaerly[i].under_examination_by_cgda +
              offsetDataYaerly[i].claims_rejected +
              offsetDataYaerly[i].claim_rejected_by_domw)
        ).toFixed(2),
        "Incomplete Claims/Clarifications Sought":
          offsetDataYaerly[i].incomplete_claims_clarification_sought,
        "Under Examination by DOMW/CGDA": parseFloat(
          offsetDataYaerly[i].under_examination_by_domw +
            offsetDataYaerly[i].under_examination_by_cgda
        ),
      });
    }


  console.log("adtadtadad",data);
    return res.status(200).send({
      status: true,
      message: "Data found successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  addDefenceOffsetOfflinedata,
  getAllDefenceOffsetOffineData,
  searchDefenceOffsetOfflinedata,
  addDefenceOffsetOnlinedata,
  getAllDefenceOffsetOnlineData,
  searchDefenceOffsetOnline,
  DefenceOffSetYearlyData,
  getDefenceOffsetYearlyData,
  searchDefenceOffsetYearlyData,
  offsetDataForDashboard,
  offsetPublicGraphDataGet,
};
