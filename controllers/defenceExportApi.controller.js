const db = require("../models");
const sequelize = require("sequelize");
const DefeceExportAPI = db.defenceExportApi;
const helper= require('../helper/helper')

const moment=require("moment");
function finalyear(id){
  if(id===1){
    return "2016-17"
  }
  else if (id==1) {
    return " 2016-17"
    }
    else if(id==2){
      return "2017-18"
    }
    else if(id==3){
      return "2018-19"
    }
    else if(id==4){
      return "2019-20"
    }
    else if(id==5){
      return "2020-21"
    }
    else if(id==6){
      return "2021-22"
    }
    else if(id==7){
      return "2022-23"
    }
    else if(id==8){
      return "2023-24"
    }
    
};

const addDefenceExportApiConfig = async (req, res) => {
  
  try {
    const {
      fin_year,
      dpsu,
      cmy_cat,
      privatecompanies,
      rdate,
      ContractValue,
    } = req.body;
    
    const userId=req.userId
   await DefeceExportAPI.create({
     fin_year:  fin_year,
      dpsu: dpsu,
      cmy_cat: cmy_cat,
      privatecompanies: privatecompanies,
      rdate: rdate ,
      ContractValue:ContractValue,
      ModifiedOn: new Date(),
      ModifiedBy: userId,
    });
    return res
      .status(200)
      .send({ status: true, message: "add DefenceExportAPI sccessfully!" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getAlldefenceExportApiConfig = async (req, res) => {
  try {
    const ApiConfigResult = [];

    console.log("All data show ",ApiConfigResult)

    const exportApiConfig = await DefeceExportAPI.findAll({});
    for (let i = 0; i < exportApiConfig.length; i++) {
      ApiConfigResult.push({
        year:exportApiConfig[i].fin_year?finalyear(exportApiConfig[i].fin_year):"",
        dpsu:exportApiConfig[i].dpsu,
        PrivateCompany:exportApiConfig[i].privatecompanies,
        scomet:exportApiConfig[i].cmy_cat,
        contractValue:exportApiConfig[i].ContractValue,
        totalAssets:parseFloat(exportApiConfig[i].dpsu+exportApiConfig[i].privatecompanies+exportApiConfig[i].cmy_cat+exportApiConfig[i].ContractValue).toFixed(2)
      })
    }

    return res.status(200).send({
      status: true,
      message: "data found ",
      data: ApiConfigResult,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getSingledefenceExportData = async (req, res) => {
  try {
    const ApiConfigResult = [];

    console.log("All data show ",ApiConfigResult)

    const exportApiConfig = await DefeceExportAPI.findOne({
      attributes:["fin_year","dpsu","privatecompanies","ModifiedOn","ContractValue"],
      order:[["fin_year","DESC"]]
    });
  const finalData={
      totalAssets:(exportApiConfig.dpsu+exportApiConfig.privatecompanies+exportApiConfig.ContractValue),
      year:exportApiConfig.fin_year?finalyear(exportApiConfig.fin_year):"",
      upadteAt:exportApiConfig.ModifiedOn?moment(exportApiConfig.ModifiedOn,"YYYY-MM-DD").format("DD/MM/YYYY"):"",
      target:"20000"
    }

    return res.status(200).send({
      status: true,
      message: "data found ",
      data: finalData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const getPercentDefenceExportData = async (req, res) => {     
  try {
    const defenceData = [];
    let totalContractValue = await DefeceExportAPI.sum("ContractValue");
    const dExport = await DefeceExportAPI.findAll({
      attributes: [
        "DefenceExportID",
        "fin_year",
        "dpsu",
        "privatecompanies",
        "cmy_cat",
        "ContractValue",
        [sequelize.fn("SUM", sequelize.col("dpsu")), "Sumofdpsu"],    
        [sequelize.fn("SUM", sequelize.col("privatecompanies")), "Sumofprivatecompanies"]
      ],
      group: ["fin_year"], 
      order: [["fin_year", "DESC"]],
    });
    const datefind = await DefeceExportAPI.findOne({
      attributes:["ModifiedOn"],
      order: [['DefenceExportID', 'DESC']],
    })
    for (let i = 0; i < dExport.length; i++) {
      if (dExport[i].DefenceExportID != req.DefenceExportID) {
        const FYear = dExport[i].fin_year
          ? await helper.getFYear(dExport[i].fin_year)
          : "";

          const sumVal= parseFloat(
            dExport[i].dpsu +
            dExport[i].privatecompanies +
            dExport[i].cmy_cat +
            dExport[i].ContractValue
          ).toFixed(2)
        defenceData.push({
          SumOfExprtVal:sumVal,
          FYear: FYear,
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: `Defence Export Percentage Found`,
      data: { totalContractValue, defenceData,AS_on: datefind.ModifiedOn ? moment(datefind.ModifiedOn, "YYYY-MM-DD").format("DD/MM/YYYY") : "", },
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getAllLastUpadtedefenceExport = async (req, res) => {
  try {
    const lastResult = [];
    const lUpdateData = await DefeceExportAPI.findAll({
      attributes: [
        "DefenceExportID",
        "fin_year",
        "dpsu",
        "privatecompanies",
        "cmy_cat",
        "ContractValue"
      ],
      group: ["fin_year"], 
    });
    const datefind = await DefeceExportAPI.findOne({
      attributes:["ModifiedOn"],
      order: [['DefenceExportID', 'DESC']],
    })
    for (let i = 0; i < lUpdateData.length; i++) {
      lastResult.push({
        year: lUpdateData[i].fin_year
          ? finalyear(lUpdateData[i].fin_year)
          : "",
          privatecompanies: lUpdateData[i].privatecompanies,
          dpsu: lUpdateData[i].dpsu,
          scomet :lUpdateData[i].cmy_cat,
          ContractValue :lUpdateData[i].ContractValue,
        totalExport: parseFloat(
          lUpdateData[i].dpsu +
          lUpdateData[i].privatecompanies +
          lUpdateData[i].cmy_cat + 
          lUpdateData[i].ContractValue
        ).toFixed(2),
      });
    }

    return res.status(200).send({
      status: true,
      message: "data found ",
      data: lastResult, ModifiedOn: datefind.ModifiedOn ? moment(datefind.ModifiedOn, "YYYY-MM-DD").format("DD/MM/YYYY") : "",
      
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = {
    addDefenceExportApiConfig,
    getAlldefenceExportApiConfig,
    getSingledefenceExportData,
    getPercentDefenceExportData,
    getAllLastUpadtedefenceExport,
    finalyear
};
  
