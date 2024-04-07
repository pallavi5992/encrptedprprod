const db = require("../models");
const MrgsIprTarget = db.mrgsIprtarget;
const MrgsConsolidatedData = db.mrgsconsolidatedData;
const { finalyear } = require("../helper/finalYear");
const { getSystemIPAddress } = require("../helper/systemIp");
const { Base64toId, idIntoBase64 } = require("../helper/idIntoBase64");
const moment=require("moment");
const { where } = require("sequelize");
const tblYear = db.tblYear;


const addmrgsIprTarget = async (req, res) => {
  try {
    const { YearID, Organization, IPRTarget } = req.body;
    const userId = req.userId;
    await MrgsIprTarget.create({
      YearID: YearID,
      Organization: Organization,
      IPRTarget: IPRTarget,
      ModifiedOn: new Date(),
      ModifiedBy: userId,
      IPAddress: getSystemIPAddress(),
    });
    return res
      .status(200)
      .send({ status: true, message: "Added MRGS IPR Targte Successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getAllMrgsIprTarget = async (req, res) => {
  try {
    const ApiMrgsIprTarget = [];

    const mrgsIprTaegte = await MrgsIprTarget.findAll({});
    for (let i = 0; i < mrgsIprTaegte.length; i++) {
      const encryptId = await idIntoBase64(mrgsIprTaegte[i].ID);

      ApiMrgsIprTarget.push({
        id: encryptId,
        YearID: mrgsIprTaegte[i].YearID? finalyear(mrgsIprTaegte[i].YearID): "",
        Organization: mrgsIprTaegte[i].Organization,
        IPRTarget: mrgsIprTaegte[i].IPRTarget,
      });
    }

    return res.status(200).send({
      status: true,
      message: "data found ",
      data: ApiMrgsIprTarget,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getByIdMrgsIprTarget = async (req, res) => {
  try {
    const { ID } = req.params;
    const actualID = await Base64toId(ID);
    const foundMrgsIprtargte = await MrgsIprTarget.findOne({
      where: {
        ID: actualID,
      },
      attributes: ["YearID", "Organization", "IPRTarget"],
    });

    if (!foundMrgsIprtargte) {
      return res.status(404).send({ status: false, message: "Data not found" });
    }

    const MrgsIprData = {
      YearID: foundMrgsIprtargte.YearID,
      Organization: foundMrgsIprtargte.Organization,
      IPRTarget: foundMrgsIprtargte.IPRTarget,
    };
    return res.status(200).send({
      status: true,
      message: " Data found Successfully",
      data: MrgsIprData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateMrgesIprTargte = async (req, res) => {
  try {
    const { ID } = req.params;
    const actualID = await Base64toId(ID);
    const { YearID, Organization, IPRTarget } = req.body;

    const foundmrgsiprdata = await MrgsIprTarget.findByPk(actualID, {});

    if (!foundmrgsiprdata) {
      return res.status(404).send({
        status: false,
        message: "Data not found",
      });
    }
    await MrgsIprTarget.update(
      {
        YearID,
        Organization,
        IPRTarget,
      },
      { where: { ID: actualID } }
    );
    return res
      .status(200)
      .send({ status: true, message: "MRGS Data updated successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};



const addmrgsConsolidatedData = async (req, res) => {
  try {
    const {
      YearID,
      Organization,
      IPRTarget,
      IPRFiled,
      IPRGranted,
      ModifiedOn,
    } = req.body;
    const userId = req.userId;

    await MrgsConsolidatedData.create({
      YearID: YearID,
      Organization: Organization,
      IPRTarget: IPRTarget,
      IPRFiled: IPRFiled,
      IPRGranted: IPRGranted,
      ModifiedOn: ModifiedOn,
      ModifiedBy: userId,
    });
    return res.status(200).send({
      status: true,
      message: "Added MRGS Consolidated Data Successfully",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const getByIdConsolidatedData = async (req, res) => {
  try {
    const { ID } = req.params;
    const actualID = await Base64toId(ID);

    const foundConsolidatedData = await MrgsConsolidatedData.findByPk(
      actualID,
      {
        attributes: [
          "YearID",
          "Organization",
          "IPRTarget",
          "IPRFiled",
          "IPRGranted",
          "ModifiedOn",
        ],
      }
    );

    if (!foundConsolidatedData) {
      return res.status(404).send({ status: false, message: "Data not found" });
    }

    return res.status(200).send({
      status: true,
      message: " Data found Successfully",
      data: foundConsolidatedData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const updateConsolidatedData = async (req, res) => {
  try {
    const { ID } = req.params;
    const actualID = await Base64toId(ID);

    const {
      YearID,
      Organization,
      IPRTarget,
      IPRFiled,
      IPRGranted,
      ModifiedOn,
    } = req.body;

    const foundMrgsConsolidatedData = await MrgsConsolidatedData.findByPk(
      actualID,
      {}
    );

    if (!foundMrgsConsolidatedData) {
      return res.status(404).send({
        status: false,
        message: "Data not found",
      });
    }
    await MrgsIprTarget.update(
      {
        YearID,
        Organization,
        IPRTarget,
        IPRFiled,
        IPRGranted,
        ModifiedOn,
      },
      { where: { ID: actualID } }
    );
    return res.status(200).send({
      status: true,
      message: "MRGS ConsolidatedData  Data updated successfully",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const getByyearIDConsolidatedData = async (req, res) => {
  try {
    const { YearID } = req.params;
    const ConsolidatedData = [];

    const foundConsolidatedData = await MrgsConsolidatedData.findAll({
      where: { YearID },
      attributes: [
        "ID",
        "Organization",
        "IPRTarget",
        "IPRFiled",
        "IPRGranted",
        "ModifiedOn",
      ],
    });

    for (let i = 0; i < foundConsolidatedData.length; i++) {
      const encryptId = await idIntoBase64(foundConsolidatedData[i].ID);

      ConsolidatedData.push({
         ID: encryptId,
         Organization: foundConsolidatedData[i].Organization,
         IPRTarget: foundConsolidatedData[i].IPRTarget,
         IPRFiled: foundConsolidatedData[i].IPRFiled,
         IPRGranted: foundConsolidatedData[i].IPRGranted,
         ModifiedOn: foundConsolidatedData[i].ModifiedOn,

      });
    }
   
    return res.status(200).send({
      status: true,
      message: "Found Data Successfully",
      data: ConsolidatedData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getsingledatadashboard = async (req, res) => {
      try {
        const yeardata = 8;

    
             const [IPRTarget, grandTotalIPRFiled, grandTotalIPRGranted,ModifiedOn] = await Promise.all([
               MrgsConsolidatedData.sum("IPRTarget", { where: { YearID: yeardata } }),
               MrgsConsolidatedData.sum("IPRFiled", { where: { YearID: yeardata } }),
               MrgsConsolidatedData.sum("IPRGranted", { where: { YearID: yeardata } }),
               MrgsConsolidatedData.findOne({
               attributes: ["ModifiedOn"],
               order: [['id', 'DESC']]
                })

              ]);
              const SingleData = {
                "IPR Target":IPRTarget,
                "IPR Filed":grandTotalIPRFiled,
                "IPR Granted":grandTotalIPRGranted,
                "As 0n":moment(ModifiedOn.ModifiedOn,"YYYY-MM-DD").format("DD/MM/YYYY")
            };
            // const a={
            //   "IPR Target":`${grandTotalIPRFiled}`
            // }
              return res.status(200).json({status: true,message: "Data found", data:SingleData
             
              });
            } catch (error) {
              return res.status(500).json({status: false,message: "Error occurred while fetching data",error: error.message,
              });
            }
          };

const getdashboardTableData = async (req, res) => {
            try {
              const yeardata = 8;
                      const data = await MrgsConsolidatedData.findAll({
                        where:{YearID:yeardata},
                  
                        attributes:["Organization","IPRTarget","IPRFiled","IPRGranted"]
                      })
                      
                      
              const [grandTotalIPRTarget, grandTotalIPRFiled, grandTotalIPRGranted,ModifiedOn,IPRTarget] = await Promise.all([
                MrgsConsolidatedData.sum("IPRTarget", { where: { YearID: yeardata } }),
                MrgsConsolidatedData.sum("IPRFiled", { where: { YearID: yeardata } }),
                MrgsConsolidatedData.sum("IPRGranted", { where: { YearID: yeardata } }),
          
                    ]);
                    return res.status(200).json({status: true,message: "Data found",
                        data,
                      grandTotalIPRTarget,
                      grandTotalIPRFiled,
                      grandTotalIPRGranted,
                    });
                  } catch (error) {
                    return res.status(500).json({status: false,message: "Error occurred while fetching data",error: error.message,
                    });
                  }
                };

                module.exports = {
                addmrgsIprTarget,
                getAllMrgsIprTarget,
                getByIdMrgsIprTarget,
                updateMrgesIprTargte,
              
                addmrgsConsolidatedData,
                getByIdConsolidatedData,
                updateConsolidatedData,
                getByyearIDConsolidatedData,
              
                getsingledatadashboard,
                getdashboardTableData
              };





          


