const db = require("../../models");
const MakeProject2DPSU = db.makeProject2DPSU;
const helper = require('../../helper/systemIp')
const helperOrg=require("../../helper/helper")
const moment = require("moment");
const { Base64toId, idIntoBase64 } = require("../../helper/idIntoBase64");


const addmakeProject2Dpsu = async (req, res) => {
   try {
    const {
      OrganisationID,
      itemCode_PartNo,
      Name_of_Project,
      AIP_Date,
      EOI_Date,
      Contract_Date,
      Withdrawn_On
    } = req.body;
   const userId=req.userId
    await MakeProject2DPSU.create({
      OrganisationID:OrganisationID,
      itemCode_PartNo:itemCode_PartNo,
      Name_of_Project:Name_of_Project,
      AIP_Date:AIP_Date,
      EOI_Date:EOI_Date,
      Contract_Date:Contract_Date,
      Withdrawn_On:Withdrawn_On,
      Deleted:"0",
      ModifiedOn:  new Date(),
      ModifiedBy: userId,
      IPAddress: helper.getSystemIPAddress(),
});
    return res
      .status(200)
      .send({ status: true, message: " added Make Project II DPSU sccessfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }

  };

  const getAllProject2Dpsu = async (req, res) => {
    try {
      const makeProject2 = [];
  
      const foundmakeProject2Dpsu = await MakeProject2DPSU.findAll({
     
        attributes: [
          "M2POFBID",
          "OrganisationID",
          "itemCode_PartNo",
          "Name_of_Project",
          "AIP_Date",
          "Contract_Date",
          "EOI_Date",
          "Withdrawn_On",
          "Deleted"
        ],
      });
  
      for (let i = 0; i < foundmakeProject2Dpsu.length; i++) {
        const encryptId = await idIntoBase64(foundmakeProject2Dpsu[i].M2POFBID);
        makeProject2.push({
          Id: encryptId,
          organisationName:foundmakeProject2Dpsu[i].OrganisationID?await helperOrg.organisationName(foundmakeProject2Dpsu[i].OrganisationID):"",
          Name_of_Project: foundmakeProject2Dpsu[i].Name_of_Project,
          itemCode_PartNo:foundmakeProject2Dpsu[i].itemCode_PartNo,
          AIP_Date: moment(foundmakeProject2Dpsu[i].AIP_Date, "YYYY-MM-DD").format(
            "DD/MM/YYYY"
          ),
          AON_Date: moment(foundmakeProject2Dpsu[i].AON_Date, "YYYY-MM-DD").format(
            "DD/MM/YYYY"
          ),
          EOI_Date: moment(foundmakeProject2Dpsu[i].EOI_Date, "YYYY-MM-DD").format(
            "DD/MM/YYYY"
          ),
          Contract_Date: moment(foundmakeProject2Dpsu[i].Contract_Date, "YYYY-MM-DD").format(
            "DD/MM/YYYY"
          ),
          Withdrawn_On: moment(
            foundmakeProject2Dpsu[i].Withdrawn_On,
            "YYYY-MM-DD"
          ).format( "DD/MM/YYYY"),
          status:foundmakeProject2Dpsu[i].Deleted
        });
      }
      return res
        .status(200)
        .send({ status: true, message: "Data found", data: makeProject2 });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };

const updatemakeProject2Dpsu = async(req, res)=>{
  try {
    const{id}= req.params;
    const actualID = await Base64toId( id)
    const {
        OrganisationID,
        itemCode_PartNo,
        Name_of_Project,
        AIP_Date,
        EOI_Date,
        Contract_Date,
        Withdrawn_On
      } = req.body;
    const foundMakeProject2Dpsu = await MakeProject2DPSU.findByPk(actualID)
   
    if(!foundMakeProject2Dpsu){
      return res .status(404) .send({status:false, message: "Data not Found"});
    }

    await MakeProject2DPSU.update({
        OrganisationID:OrganisationID,
        itemCode_PartNo:itemCode_PartNo,
        Name_of_Project:Name_of_Project,
        AIP_Date:AIP_Date,
        EOI_Date:EOI_Date,
        Contract_Date:Contract_Date,
        Withdrawn_On:Withdrawn_On,
        ModifiedOn:  new Date(),
        ModifiedBy: req.userId,
        IPAddress: helper.getSystemIPAddress(),
    },
      { where: { M2POFBID:actualID } }
   )
    return res.status(200) .send({staus:true, message: " Data Update Successfully"})
    
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
    
  }
}

const getByIDmakeProject2Dpsu= async (req, res) => {
  try {
    const { id } = req.params;
    const actualID = await Base64toId( id)

    const foundmakeProject2Dpsu = await MakeProject2DPSU.findOne(
    
      {
        where:{
        M2POFBID:actualID
        },
        attributes: [
            "OrganisationID",
            "itemCode_PartNo",
            "Name_of_Project",
            "AIP_Date",
            "Contract_Date",
            "EOI_Date",
            "Withdrawn_On"
        ],
      }
    );

    if (!foundmakeProject2Dpsu) {
      return res.status(400).send({
        status: false,
        message: `Data not found`,
      });
    }
    const makeproject2DpsuData = {
      OrganisationID: foundmakeProject2Dpsu.OrganisationID,
      Name_of_Project: foundmakeProject2Dpsu.Name_of_Project ,
      itemCode_PartNo:foundmakeProject2Dpsu.itemCode_PartNo,
      AIP_Date: moment( foundmakeProject2Dpsu.AIP_Date,"YYYY-MM-DD").format("YYYY-MM-DD"),

      EOI_Date: moment( foundmakeProject2Dpsu.EOI_Date,"YYYY-MM-DD").format("YYYY-MM-DD"),
       Withdrawn_On:foundmakeProject2Dpsu.Withdrawn_On? moment( foundmakeProject2Dpsu.Withdrawn_On,"YYYY-MM-DD").format("YYYY-MM-DD"):"",
       Contract_Date:foundmakeProject2Dpsu.Contract_Date?moment( foundmakeProject2Dpsu.Contract_Date,"YYYY-MM-DD").format("YYYY-MM-DD"):"",
    };
    return res.status(200).send({
      status: true,
      message: "Data found successfully",
      data: makeproject2DpsuData,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
const deletemakeProject2Dpsu = async (req, res) => {
  try {
    const { id } = req.params;
 
    const status = req.query.status;
    const actualID = await Base64toId( id)
    if (!status) {
      return res
        .status(400)
        .send({ status: true, message: "Please enter status" });
    }

    if (status == "1") {
      await MakeProject2DPSU.update(
        {
          Deleted: status,
        },
        {
          where: {
            M2POFBID: actualID,
          },
        }
      );

      return res
        .status(200)
        .send({
          status: true,
          message: "Make Project2Dpsu inActive successfully",
        });
    } 
    else if(status=="0"){
      await MakeProject2DPSU.update(
        {
          Deleted: status,
        },
        {
          where: {
            M2POFBID: actualID,
          },
        }
      );

      return res
        .status(200)
        .send({
          status: true,
          message: "Make Project2Dpsu active successfully",
        });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

   module.exports = {
    addmakeProject2Dpsu,
    getAllProject2Dpsu,
    updatemakeProject2Dpsu,
    deletemakeProject2Dpsu,
    getByIDmakeProject2Dpsu,

  };
  
