const db = require("../../models");
const MakeProject2DAP = db.makeProject2DAP;
const helper = require('../../helper/systemIp')
const moment = require("moment");
const { Base64toId, idIntoBase64 } = require("../../helper/idIntoBase64");


const addmakeProject2DAP = async (req, res) => {
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
    await MakeProject2DAP.create({
      SHQ:SHQ,
      Name_of_Project:Name_of_Project,
      AIP_Date:AIP_Date,
      AON_Date:AON_Date,
      PSO_Date:PSO_Date,
      Withdrawn_On:Withdrawn_On,
      ModifiedOn:  new Date(),
      ModifiedBy: userId,
      IPAddress: helper.getSystemIPAddress(),
});
    return res
      .status(200)
      .send({ status: true, message: " added Make ProjectII-DAP sccessfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }

  };

  const getAllProject2DAP = async (req, res) => {
    try {
      const makeProject2 = [];
  
      const foundmakeProject2Dap = await MakeProject2DAP.findAll({
     
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
  
      for (let i = 0; i < foundmakeProject2Dap.length; i++) {
        const encryptId = await idIntoBase64(foundmakeProject2Dap[i].M2PDPPID);
        makeProject2.push({
          Id: encryptId,
          SHQ: foundmakeProject2Dap[i].SHQ,
          Name_of_Project: foundmakeProject2Dap[i].Name_of_Project,
          AIP_Date: moment(foundmakeProject2Dap[i].AIP_Date, "YYYY-MM-DD").format(
            "DD/MM/YYYY"
          ),
          AON_Date: moment(foundmakeProject2Dap[i].AON_Date, "YYYY-MM-DD").format(
            "DD/MM/YYYY"
          ),
          PSO_Date: moment(foundmakeProject2Dap[i].PSO_Date, "YYYY-MM-DD").format(
            "DD/MM/YYYY"
          ),
          Withdrawn_On: moment(
            foundmakeProject2Dap[i].Withdrawn_On,
            "YYYY-MM-DD"
          ).format( "DD/MM/YYYY"),
          status:foundmakeProject2Dap[i].Deleted
        });
      }
      return res
        .status(200)
        .send({ status: true, message: "Data found", data: makeProject2 });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };

const updatemakeProject2DAP = async(req, res)=>{
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
    const foundMakeProject2DAP = await MakeProject2DAP.findByPk(actualID)
   
    if(!foundMakeProject2DAP){
      return res .status(404) .send({status:false, message: "Data not Found"});
    }

    await MakeProject2DAP.update({
      SHQ,
      Name_of_Project,
      AIP_Date,
      AON_Date,
      PSO_Date,
      Withdrawn_On,
    },
      { where: { M2PDPPID:actualID } }
   )
    return res.status(200) .send({staus:true, message: " Data Update Successfully"})
    
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
    
  }
}

const getByIDmakeProject2DAP= async (req, res) => {
  try {
    const { M2PDPPID } = req.params;
    const actualID = await Base64toId( M2PDPPID)

    const foundmakeProject2DAP = await MakeProject2DAP.findOne(
    
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
        ],
      }
    );

    if (!foundmakeProject2DAP) {
      return res.status(404).send({
        status: false,
        message: `Data not found`,
      });
    }
    const makeproject2DapData = {
      SHQ: foundmakeProject2DAP.SHQ,
      Name_of_Project: foundmakeProject2DAP.Name_of_Project ,
      AIP_Date: moment( foundmakeProject2DAP.AIP_Date,"YYYY-MM-DD").format("YYYY-MM-DD"),

      AON_Date: moment( foundmakeProject2DAP.AON_Date,"YYYY-MM-DD").format("YYYY-MM-DD"),

      PSO_Date: moment( foundmakeProject2DAP.PSO_Date,"YYYY-MM-DD").format("YYYY-MM-DD"),
       Withdrawn_On: moment( foundmakeProject2DAP.Withdrawn_On,"YYYY-MM-DD").format("YYYY-MM-DD"),
    };
    return res.status(200).send({
      status: true,
      message: "Data found successfully",
      data: makeproject2DapData,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
const deletemakeProject2DAP = async (req, res) => {
  try {
    const { M2PDPPID } = req.params;
 
    const status = req.query.status;
    const actualID = await Base64toId( M2PDPPID)
    if (!status) {
      return res
        .status(400)
        .send({ status: true, message: "Please enter status" });
    }

    if (status == "1") {
      await MakeProject2DAP.update(
        {
          Deleted: status,
        },
        {
          where: {
            M2PDPPID: actualID,
          },
        }
      );

      return res
        .status(200)
        .send({
          status: true,
          message: "Make Project2DAP inActive successfully",
        });
    } 
    else if(status=="0"){
      await MakeProject2DAP.update(
        {
          Deleted: status,
        },
        {
          where: {
            M2PDPPID: actualID,
          },
        }
      );

      return res
        .status(200)
        .send({
          status: true,
          message: "Make Project2DAP active successfully",
        });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

   module.exports = {
    addmakeProject2DAP,
    getAllProject2DAP,
    updatemakeProject2DAP,
    deletemakeProject2DAP,
    getByIDmakeProject2DAP,

  };
  
