const db = require("../../models");
const MakeProject1 = db.makeProject1;
const helper = require('../../helper/systemIp');
var CryptoJS = require("crypto-js");
const moment = require("moment");
const { idIntoBase64, Base64toId } = require("../../helper/idIntoBase64");

const addmakeProject1 = async (req, res) => {
   try {
    const {
      SHQ,
      ProjectName,
      Qauntity,
      TentativeCost,
      AIP_Date,
      Remarks,
    } = req.body;
   const userId=req.userId
    await MakeProject1.create({
      SHQ: SHQ,
      ProjectName:ProjectName,
      Qauntity: Qauntity,
      TentativeCost:TentativeCost,
      AIP_Date:AIP_Date,
      Remarks:Remarks,
      Deleted:"0",
      ModifiedOn:  new Date(),
      ModifiedBy: userId,
      IPAddress: helper.getSystemIPAddress()
     
  });
    return res
      .status(200)
      .send({ status: true, message: " added Make Project sccessfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }

};

  const getallmakeProject1 =async(req, res)=>{
    try {
      const MakeProjectData = [];
      const key = req.query.key;
      const makeproject = await MakeProject1.findAll({  
        attributes: [
          "id",
          "SHQ",
          "ProjectName",
          "AIP_Date",
          "Remarks",
          "Deleted"
        ],
        order: [
          ["id", "DESC"], // Sorts by COLUMN in ascending order  
        ],
      });
  
      for (let i = 0; i < makeproject.length; i++) {
         const encoded =await idIntoBase64(makeproject[i].id)
        MakeProjectData.push({
          id:encoded,
          SHQ: makeproject[i].SHQ,
          ProjectName: makeproject[i].ProjectName,
          AIP_Date: makeproject[i].AIP_Date?moment(makeproject[i].AIP_Date,"YYYY-MM-DD").format("DD/MM/YYYY"):"",
          Remarks: makeproject[i].Remarks,
          status: makeproject[i].Deleted,
        });
      }
  
      if (key) {
        const prodData = MakeProjectData.filter((item) => {
          return (
            String(item.SHQ).includes(key) ||
            String(item.ProjectName).includes(key) ||
            String(item.AIP_Date).includes(key)       
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


  const getMakeProjectById1 =async(req, res)=>{
    try {
      const makeId = req.query.makeId;

    const actualId=await Base64toId(makeId)

    const makeproject = await MakeProject1.findOne({  
        where:{
          id:parseInt(actualId)
        },
        attributes: [
            "SHQ",
            "ProjectName",
            "Qauntity",
            "TentativeCost",
            "AIP_Date",
            "Remarks",
        ],
      });
  
      const makeData={
          SHQ: makeproject.SHQ,
          ProjectName: makeproject.ProjectName,
          Qauntity: makeproject.Qauntity||"",
          TentativeCost: makeproject.TentativeCost||"",
          AIP_Date: makeproject.AIP_Date?moment( makeproject.AIP_Date,"YYYY-MM-DD").format("YYYY-MM-DD"):"",
          Remarks: makeproject.Remarks||"",
        };
        return res
          .status(200)
          .send({ status: true, message: "Data found", data: makeData });
      
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }

  }

  
const updatemakeProject1 = async(req,res)=>{
  try {

    const{id}= req.params;
    const actualId = await Base64toId(id);
    const { 
        SHQ,
        ProjectName,
        Qauntity,
        TentativeCost,
        AIP_Date,
        Remarks,
    }=req.body;
    const foundMakeProject = await MakeProject1.findByPk(parseInt(actualId));
    if(!foundMakeProject){
      return res .status(200) .send({status:false, message: "Data not Found"});
    }

    await MakeProject1.update({
        SHQ,
        ProjectName,
        Qauntity,
        TentativeCost,
        AIP_Date,
        Remarks,
    },{
      where:{
        id:parseInt(actualId)
      }
    })
    return res.status(200) .send({staus:true, message: " Data Update Successfully"})
    
  } catch (error) {
     return res .status(500). send({status: false, message: error.message})
    
  }
};
const deletemakeProject1 = async (req, res) => {
  try {
    const { id } = req.params;
    const actualId = await Base64toId(id);
    const status = req.query.status;
    if (!status) {
      return res
        .status(400)
        .send({ status: true, message: "Please enter status" });
    }

    if (status == "1") {
      await MakeProject1.update(
        {
          Deleted: status,
        },
        {
          where: {
            id: parseInt(actualId),
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
      await MakeProject1.update(
        {
          Deleted: status,
        },
        {
          where: {
            id: parseInt(actualId),
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
    addmakeProject1,
    getallmakeProject1,
    updatemakeProject1,
    deletemakeProject1,
    getMakeProjectById1
};