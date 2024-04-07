const db = require("../../models");
const MakeProject = db.makeProject;
const {getSystemIPAddress} =require("../../helper/systemIp")
const { months } = require("../../helper/finalYear");
const { Base64toId, idIntoBase64 } = require("../../helper/idIntoBase64");
// const helper= require("../../helper/helper")
const tblYear = db.tblYear;
const {getFYear} = require('../../helper/helper')



const addmakeProject = async (req, res) => {
   try {
    const {
      YearID,
      MonthID,
      AIP_Accorded_DPP,
      AIP_Dropped_DPP,
      AIP_Accorded_OFB,
      AIP_Dropped_OFB,
    } = req.body;
   const userId=req.userId
    await MakeProject.create({
      YearID: YearID,
      MonthID:MonthID,
      AIP_Accorded_DPP: AIP_Accorded_DPP,
      AIP_Dropped_DPP:AIP_Dropped_DPP,
      AIP_Accorded_OFB:AIP_Accorded_OFB,
      AIP_Dropped_OFB:AIP_Dropped_OFB,
      ModifiedOn:  new Date(),
      ModifiedBy: userId,
      IPAddress: getSystemIPAddress()
     
  });
    return res
      .status(200)
      .send({ status: true, message: " added Make Project sccessfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }

  };

  const getallmakeProject =async(req, res)=>{
    try {
      const MakeProjectData = [];
      const key = req.query.key;
      const makeproject = await MakeProject.findAll({  
        attributes: [
          "M2PID",
          "YearID",
          "MonthID",
          "AIP_Accorded_DPP",
          "AIP_Dropped_DPP",
          "AIP_Accorded_OFB",
          "AIP_Dropped_OFB",
          "Deleted", 
        ],
      });
  
      for (let i = 0; i < makeproject.length; i++) {
        const encoded =await idIntoBase64(makeproject[i].M2PID)
        MakeProjectData.push({
          id:encoded,
          YearID: await getFYear(makeproject[i].YearID),
      
          MonthID: months(makeproject[i].MonthID),
          AIP_Accorded_DPP: makeproject[i].AIP_Accorded_DPP,
          AIP_Dropped_DPP: makeproject[i].AIP_Dropped_DPP,
          AIP_Accorded_OFB: makeproject[i].AIP_Accorded_OFB,
          AIP_Dropped_OFB: makeproject[i].AIP_Dropped_OFB,
          status: makeproject[i].Deleted,
        });
      }
  
      if (key) {
        const prodData = MakeProjectData.filter((item) => {
          return (
            item.YearID.includes(key) ||
            String(item.MonthID).includes(key) ||
            String(item.AIP_Accorded_DPP).includes(key) ||
            String(item.AIP_Dropped_DPP).includes(key) ||
            String(item.AIP_Accorded_OFB).includes(key) ||
            String(item.AIP_Dropped_OFB).includes(key) 
      
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
        result.dataItems = MakeProjectData.slice(startIndex, endIndex);
        result.totalItems = MakeProjectData.length;
        result.totalPage = Math.ceil(MakeProjectData.length / limit);
        result.currentPage = page;
        return res
          .status(200)
          .send({ status: true, message: "Data found", data: result });
      }
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }

  }


  const getMakeProjectById =async(req, res)=>{
    try {
      const makeId = req.query.makeId;
      const actualId=await Base64toId(makeId)
      const makeproject = await MakeProject.findOne({  
        where:{
          M2PID:actualId
        },
        attributes: [
          "YearID",
          "MonthID",
          "AIP_Accorded_DPP",
          "AIP_Dropped_DPP",
          "AIP_Accorded_OFB",
          "AIP_Dropped_OFB",
        ],
      });
  
      const makeData={
          YearID: makeproject.YearID,
          MonthID: makeproject.MonthID,
          AIP_Accorded_DPP: makeproject.AIP_Accorded_DPP||"",
          AIP_Dropped_DPP: makeproject.AIP_Dropped_DPP||"",
          AIP_Accorded_OFB: makeproject.AIP_Accorded_OFB||"",
          AIP_Dropped_OFB: makeproject.AIP_Dropped_OFB||"",
        };
        return res
          .status(200)
          .send({ status: true, message: "Data found", data: makeData });
      
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }

  }

  
const updatemakeProject = async(req,res)=>{
  try {

    const{M2PID}= req.params;
    const actualId=await Base64toId(M2PID)
    const { 
      YearID,
      MonthID,
      AIP_Accorded_DPP,
      AIP_Dropped_DPP,
      AIP_Accorded_OFB,
      AIP_Dropped_OFB,
    }=req.body;
    const foundMakeProject = await MakeProject.findByPk(actualId);
    if(!foundMakeProject){
      return res .status(200) .send({status:false, message: "Data not Found"});
    }

    await MakeProject.update({
      YearID,
      MonthID,
      AIP_Accorded_DPP,
      AIP_Dropped_DPP,
      AIP_Accorded_OFB,
      AIP_Dropped_OFB,
    },{
      where:{
        M2PID:actualId
      }
    })
    return res.status(200) .send({staus:true, message: " Data Update Successfully"})
    
  } catch (error) {
     return res .status(500). send({status: false, message: error.message})
    
  }
};
const deletemakeProject = async (req, res) => {
  try {
    const { M2PID } = req.params;
    const actualId=await Base64toId(M2PID)
    const status = req.query.status;
    if (!status) {
      return res
        .status(400)
        .send({ status: true, message: "Please enter status" });
    }

    if (status == "1") {
      await MakeProject.update(
        {
          Deleted: status,
        },
        {
          where: {
            M2PID: actualId,
          },
        }
      );

      return res
        .status(200)
        .send({
          status: true,
          message: "Make Project inActive successfully",
        });
    } else {
      await MakeProject.update(
        {
          Deleted: status,
        },
        {
          where: {
            M2PID: actualId,
          },
        }
      );

      return res
        .status(200)
        .send({
          status: true,
          message: "Make Project active successfully",
        });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
   module.exports = {
    addmakeProject,
    getallmakeProject,
    updatemakeProject,
    deletemakeProject,
    getMakeProjectById
  };