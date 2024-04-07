const db = require("../../models");
const MakeProject3 = db.makeProject3;
const {getSystemIPAddress} = require('../../helper/systemIp');
const { finalyear,months } = require("../../helper/finalYear");
const { Base64toId, idIntoBase64 } = require("../../helper/idIntoBase64");


const addmakeProject3 = async (req, res) => {
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
    await MakeProject3.create({
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
      .send({ status: true, message: " added Make Project3 sccessfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }

};

const getallmakeProject3 =async(req, res)=>{
    try {
      const MakeProjectData3 = [];
      const key = req.query.key;
      const makeproject = await MakeProject3.findAll({  
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
        // console.log("ajay",MakeProjectData3)
        MakeProjectData3.push({
          id:encoded,
          YearID: finalyear(makeproject[i].YearID),
          MonthID: months(makeproject[i].MonthID),
          AIP_Accorded_DPP: makeproject[i].AIP_Accorded_DPP,
          AIP_Dropped_DPP: makeproject[i].AIP_Dropped_DPP,
          AIP_Accorded_OFB: makeproject[i].AIP_Accorded_OFB,
          AIP_Dropped_OFB: makeproject[i].AIP_Dropped_OFB,
          status: makeproject[i].Deleted,
        });
      }
  
      if (key) {
        const prodData = MakeProjectData3.filter((item) => {
          return (
            item.YearID.includes(key) ||
            String(item.MonthID).includes(key) ||
            String(item.AIP_Accorded_DPP).includes(key) ||
            String(item.AIP_Dropped_DPP).includes(key) 
      
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
        result.dataItems = MakeProjectData3.slice(startIndex, endIndex);
        result.totalItems = MakeProjectData3.length;
        result.totalPage = Math.ceil(MakeProjectData3.length / limit);
        result.currentPage = page;
        return res
          .status(200)
          .send({ status: true, message: "Data found", data: result });
      }
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }

  }
const getMakeProject3ById =async(req, res)=>{
    try {
      const makeId = req.query.makeId;
      const actualId=await Base64toId(makeId)
      const makeProject3 = await MakeProject3.findOne({  
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
          YearID: makeProject3.YearID,
          MonthID: makeProject3.MonthID,
          AIP_Accorded_DPP: makeProject3.AIP_Accorded_DPP||"",
          AIP_Dropped_DPP: makeProject3.AIP_Dropped_DPP||"",
          AIP_Accorded_OFB: makeProject3.AIP_Accorded_OFB||"",
          AIP_Dropped_OFB: makeProject3.AIP_Dropped_OFB||"",
        };
        return res
          .status(200)
          .send({ status: true, message: "Data found", data: makeData });
      
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }

  }

  const updatemakeProject3 = async(req,res)=>{
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
    const foundMakeProject = await MakeProject3.findByPk(actualId);
    if(!foundMakeProject){
      return res .status(200) .send({status:false, message: "Data not Found"});
    }

    await MakeProject3.update({
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
const deletemakeProject3 = async (req, res) => {
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
      await MakeProject3.update(
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
          message: "Make Project3 inActive successfully",
        });
    } else {
      await MakeProject3.update(
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
          message: "Make Project3 active successfully",
        });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
module.exports = {
    addmakeProject3,
    getallmakeProject3,
    getMakeProject3ById,
    updatemakeProject3,
    deletemakeProject3

 
  };