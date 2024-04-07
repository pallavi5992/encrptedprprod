const db = require("../models");
const moment=require("moment")
const ModuleConfig = db.moduleConfig;
const helper=require("../helper/helper");
const { format } = require("mysql2");


function yearDataToYaer(id){
  if(id==1){
    return "2016-17"
  }
  else if(id==1){
    return "2017-18"
  }
  else if(id==2){
    return "2018-19"
  }
  else if(id==3){
    return "2019-20"
  }
  else if(id==4){
    return "2020-21"
  }
  else if(id==5){
    return "2021-22"
  }
  else if(id==6){
    return "2022-23"
  }
  else if(id==7){
    return "2023-24"
  }
  else if(id==8){
    return "2024-25"
  }
};

function DataRefreshFreq(id){
  if(id==1){
    return "Monthly"
  }else if(id==2){
    return "Quarterly"
  }else if(id==3){
    return "Weekly"
  }
}

const addModuleConfig = async (req, res) => {
  try {
    const {
      ModuleID,
      DataYearID,
      Target,
      TargetYearID,
      DataRefershFrequency,
      As_On_Date,
      StartupEngaged,
      ContractsSigned,
      ConsolidatedMonth,
      TargetFor,
    } = req.body;

    const userId=req.userId

    const isModuleIdConfigData=await ModuleConfig.findOne({
      where:{
        ModuleID:ModuleID
      }
    });

    if(isModuleIdConfigData){
      await ModuleConfig.update({
        DataYearID: DataYearID,
        Target: Target,
        TargetYearID: TargetYearID,
        DataRefershFrequency: DataRefershFrequency,
        ModifiedOn:  new Date(),
        ModifiedBy: userId,
        As_On_Date:As_On_Date,
        StartupEngaged: StartupEngaged,
        ContractsSigned: ContractsSigned,
        ConsolidatedMonth: ConsolidatedMonth,
        TargetFor: TargetFor||null,
      },{
        where:{
          ModuleID:ModuleID
        }
      });
      return res
      .status(200)
      .send({
        status: true,
        message: "Module configuration upadted successfully",
      });
    }else{
      await ModuleConfig.create({
        ModuleID: ModuleID,
        DataYearID: DataYearID,
        Target: Target,
        TargetYearID: TargetYearID,
        DataRefershFrequency: DataRefershFrequency,
        ModifiedOn:  new Date(),
        ModifiedBy: userId,
        As_On_Date:As_On_Date,
        StartupEngaged: StartupEngaged,
        ContractsSigned: ContractsSigned,
        ConsolidatedMonth: ConsolidatedMonth,
        TargetFor: TargetFor||null,
      });
      return res
      .status(200)
      .send({
        status: true,
        message: "Module configuration added successfully",
      });
    }

   

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getModuleConfigByModuleId=async(req,res)=>{
    try {
        const moduleId=req.query.moduleId;
        const configData=await ModuleConfig.findOne({
            where:{
                ModuleID:moduleId
            }
        })
        return res.status(200).send({ status: true, message: "data found",data:configData });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
        
    }
}

const updateModuleConfig = async (req, res) => {
    try {
      const {
        ModuleID,
        DataYearID,
        Target,
        TargetYearID,
        DataRefershFrequency,
        As_On_Date,
        StartupEngaged,
        ContractsSigned,
        ConsolidatedMonth,
        TargetFor,
      } = req.body;
  
      const userId=req.userId
  

      await ModuleConfig.create({
        ModuleID: ModuleID,
        DataYearID: DataYearID,
        Target: Target,
        TargetYearID: TargetYearID,
        DataRefershFrequency: DataRefershFrequency,
        ModifiedOn:  new Date(),
        ModifiedBy: userId,
        As_On_Date:As_On_Date,
        StartupEngaged: StartupEngaged,
        ContractsSigned: ContractsSigned,
        ConsolidatedMonth: ConsolidatedMonth,
        TargetFor: TargetFor||null,
      });
      return res
        .status(200)
        .send({
          status: true,
          message: "Module configuration updated successfully",
        });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
};



const getAllModuleConfig=async(req,res)=>{
  try {
     const configResult=[]
      const configData=await ModuleConfig.findAll({});
      for(let i=0;i<configData.length;i++){
        configResult.push({
          moduleName:configData[i].ModuleID?await helper.moduleName(configData[i].ModuleID):"",
          DataYearID:configData[i].DataYearID?yearDataToYaer(configData[i].DataYearID):"",
          Target:configData[i].Target?JSON.parse(configData[i].Target):"",
          TargetYearID:configData[i].TargetYearID?yearDataToYaer(configData[i].TargetYearID):"",
          DataRefershFrequency:configData[i].DataRefershFrequency?DataRefreshFreq(configData[i].DataRefershFrequency):"",
          As_On_Date:configData[i].As_On_Date?moment(configData[i].As_On_Date,["YYYY-MM-DD"]).format("DD-MM-YYYY"):"",
          StartupEngaged:configData[i].StartupEngaged||0,
          ContractsSigned:configData[i].ContractsSigned||0,
          ConsolidatedMonth:configData[i].ConsolidatedMonth||"",
          TargetFor:configData[i].TargetFor||"",
          ModifiedBy:configData[i].ModifiedBy?await helper.userName(configData[i].ModifiedBy):""
        })
      }
      return res.status(200).send({ status: true, message: "data found",data:configResult });

  } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
      
  }
}


module.exports = {
  addModuleConfig,
  getModuleConfigByModuleId,
  updateModuleConfig,
  getAllModuleConfig
};
