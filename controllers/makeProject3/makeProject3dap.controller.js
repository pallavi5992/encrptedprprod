const db = require ("../../models");
const MakeProject3DAP= db.makeProject3DAP
const{getSystemIPAddress} =require('../../helper/systemIp')
const moment = require("moment");
const { Base64toId, idIntoBase64 } = require("../../helper/idIntoBase64");

 

const admakeProject3DAP =async(req, res)=>{
    try {
        const {
          SHQ,
          Name_of_Project,
          AIP_Date,
          AON_Date,
          PSO_Date,
          Withdrawn_On,
        } = req.body;
       const userId=req.userId
        await MakeProject3DAP.create({
          SHQ:SHQ,
          Name_of_Project:Name_of_Project,
          AIP_Date:AIP_Date,
          AON_Date:AON_Date,
          PSO_Date:PSO_Date,
          Withdrawn_On:Withdrawn_On||null,
          ModifiedOn:  new Date(),
          ModifiedBy: userId,
          IPAddress: getSystemIPAddress(),
    });
        return res
          .status(200)
          .send({ status: true, message: " added Make ProjectIII-DAP sccessfully" });
      } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
      }
}

const getAllProject2DAp = async (req, res)=>{
    try {
        const makeProject3 = [];
        const key = req.query.key;

        
        const foundmakeProject3Dap = await MakeProject3DAP.findAll({
          attributes: [
            "M2PDPPID",
            "SHQ",
            "Name_of_Project",
            "AIP_Date",
            "AON_Date",
            "PSO_Date",
            "Withdrawn_On",
            "Deleted"
          ],
        });
    
        for (let i = 0; i < foundmakeProject3Dap.length; i++) {
          const encryptId = await idIntoBase64(foundmakeProject3Dap[i].M2PDPPID);
          makeProject3.push({
            Id: encryptId,
            SHQ: foundmakeProject3Dap[i].SHQ,
            Name_of_Project: foundmakeProject3Dap[i].Name_of_Project,
            AIP_Date: moment(foundmakeProject3Dap[i].AIP_Date, "YYYY-MM-DD").format(
              "DD/MM/YYYY"
            ),
            AON_Date: moment(foundmakeProject3Dap[i].AON_Date, "YYYY-MM-DD").format(
              "DD/MM/YYYY"
            ),
            PSO_Date: moment(foundmakeProject3Dap[i].PSO_Date, "YYYY-MM-DD").format(
              "DD/MM/YYYY"
            ),
            Withdrawn_On: foundmakeProject3Dap[i].Withdrawn_On? moment(
              foundmakeProject3Dap[i].Withdrawn_On,
              "YYYY-MM-DD"
            ).format( "DD/MM/YYYY"):"",
            status: foundmakeProject3Dap[i].Deleted,
          });
        }
        return res
          .status(200)
          .send({ status: true, message: "Data found", data: makeProject3 });
      } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
      }
}
const updatemakeProject3DAP=async(req, res)=>{
    try {
        const{M2PDPPID}= req.params;
        const actualID = await Base64toId( M2PDPPID)
        const { 
          SHQ,
          Name_of_Project,
          AIP_Date,
          AON_Date,
          PSO_Date,
          Withdrawn_On,
        }=req.body;
        const foundmakeProject3Dap = await MakeProject3DAP.findByPk(actualID)
       
        if(!foundmakeProject3Dap){
          return res .status(404) .send({status:false, message: "Data not Found"});
        }
    
        await MakeProject3DAP.update({
          SHQ:SHQ,
          Name_of_Project:Name_of_Project||foundmakeProject3Dap.Name_of_Project,
          AIP_Date:AIP_Date||foundmakeProject3Dap.AIP_Date,
          AON_Date:AON_Date||foundmakeProject3Dap.AON_Date,
          PSO_Date:PSO_Date||foundmakeProject3Dap.PSO_Date,
          Withdrawn_On:Withdrawn_On||foundmakeProject3Dap.Withdrawn_On,
        },
          { where: { M2PDPPID:actualID } }
       )
        return res.status(200) .send({staus:true, message: " Data Update Successfully"})
        
      } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
        
      }
}
const getbyIDmakeProject3Dap = async (req, res)=>{

    try {
        const { M2PDPPID } = req.params;
        const actualID = await Base64toId( M2PDPPID)
    
        const foundmakeProject3DAP = await MakeProject3DAP.findOne(
            
          {
            where:{
              M2PDPPID:actualID
            },
            attributes: [
              "SHQ",
              "Name_of_Project",
              "AIP_Date",
              "AON_Date",
              "PSO_Date",
              "Withdrawn_On",
              "Deleted", 
            ],
          }
        );
    
        if (!foundmakeProject3DAP) {
          return res.status(404).send({
            status: false,
            message: `Data not found`,
          });
        }
        const makeproject3DapData = {
          SHQ: foundmakeProject3DAP.SHQ,
          Name_of_Project: foundmakeProject3DAP.Name_of_Project ,
          AIP_Date: moment( foundmakeProject3DAP.AIP_Date,"YYYY-MM-DD").format("YYYY-MM-DD"),
    
          AON_Date: moment( foundmakeProject3DAP.AON_Date,"YYYY-MM-DD").format("YYYY-MM-DD"),
    
          PSO_Date:foundmakeProject3DAP.PSO_Date? moment( foundmakeProject3DAP.PSO_Date,"YYYY-MM-DD").format("YYYY-MM-DD"):"",
           Withdrawn_On: foundmakeProject3DAP.Withdrawn_On? moment( foundmakeProject3DAP.Withdrawn_On,"YYYY-MM-DD").format("YYYY-MM-DD"):"",
           status: foundmakeProject3DAP.Deleted,
        };
        return res.status(200).send({
          status: true,
          message: "Data found successfully",
          data: makeproject3DapData,
        });
      } catch (error) {
        return res.status(500).send({
          status: false,
          message: error.message,
        });
      }
}

const deletemakeProject3Dap =async(req, res)=>{
    try {
        const { M2PDPPID } = req.params;
        actualId = await Base64toId(M2PDPPID)
     
        const status = req.query.status;
        if (!status) {
          return res
            .status(400)
            .send({ status: true, message: "Please enter status" });
        }
    
        if (status == "1") {
          await MakeProject3DAP.update(
            {
              Deleted: status,
            },
            {
              where: {
                M2PDPPID: actualId,
              },
            }
          );
    
          return res
            .status(200)
            .send({
              status: true,
              message: "Make Project3DAP inActive successfully",
            });
        } else {
          await MakeProject3DAP.update(
            {
              Deleted: status,
            },
            {
              where: {
                M2PDPPID: actualId,
              },
            }
          );
    
          return res
            .status(200)
            .send({
              status: true,
              message: "Make Project3DAP active successfully",
            });
        }
      } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
      }
}
module.exports={
    admakeProject3DAP,
    getAllProject2DAp,
    updatemakeProject3DAP,
    getbyIDmakeProject3Dap,
    deletemakeProject3Dap
}









