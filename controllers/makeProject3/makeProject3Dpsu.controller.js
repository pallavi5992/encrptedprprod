const db = require("../../models");
const MakeProject3DPSU = db.makeProject3DPSU;
const { getSystemIPAddress } = require("../../helper/systemIp");
const moment = require("moment");
const helperOrg=require("../../helper/helper")
const Organization = db.organisation;

const { Base64toId, idIntoBase64 } = require("../../helper/idIntoBase64");

const addmakeProject3DPSU = async (req, res) => {
  try {
    const {
      OrganisationID,
      itemCode_PartNo,
      Name_of_Project,
      AIP_Date,
      EOI_Date,
      Contract_Date,
      Withdrawn_On,
    } = req.body;
    const userId = req.userId;
    await MakeProject3DPSU.create({
      OrganisationID: OrganisationID,
      itemCode_PartNo: itemCode_PartNo,
      Name_of_Project: Name_of_Project,
      AIP_Date: AIP_Date,
      EOI_Date: EOI_Date,
      Contract_Date: Contract_Date,
      Withdrawn_On: Withdrawn_On,
      Deleted: "0",
      ModifiedOn: new Date(),
      ModifiedBy: userId,
      IPAddress: getSystemIPAddress(),
    });
    return res.status(200).send({
      status: true,
      message: "added makeProject3Dpsu successfully",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const getAllProject3Dpsu = async (req, res) => {
  try {
    const makeProject3 = [];
    
    const foundmakeProject3Dpsu = await MakeProject3DPSU.findAll({
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

    for (let i = 0; i < foundmakeProject3Dpsu.length; i++) {
      const encryptId = await idIntoBase64(foundmakeProject3Dpsu[i].M2POFBID);
      makeProject3.push({
        Id: encryptId,
        organisationName:foundmakeProject3Dpsu[i].OrganisationID?await helperOrg.organisationName(foundmakeProject3Dpsu[i].OrganisationID):"",
        Name_of_Project: foundmakeProject3Dpsu[i].Name_of_Project,
        itemCode_PartNo: foundmakeProject3Dpsu[i].itemCode_PartNo,
        AIP_Date: moment(foundmakeProject3Dpsu[i].AIP_Date,"YYYY-MM-DD").format("DD/MM/YYYY"),
         EOI_Date: moment(foundmakeProject3Dpsu[i].EOI_Date,"YYYY-MM-DD").format("DD/MM/YYYY"), 
         Contract_Date: moment(foundmakeProject3Dpsu[i].Contract_Date,"YYYY-MM-DD").format("DD/MM/YYYY"),
        Withdrawn_On: moment(foundmakeProject3Dpsu[i].Withdrawn_On,"YYYY-MM-DD").format("DD/MM/YYYY"),
        status: foundmakeProject3Dpsu[i].Deleted,
      });
    }
    return res
      .status(200)
      .send({ status: true, message: "Data found", data: makeProject3 });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const getByIDmakeProject3Dpsu = async (req, res) => {
  try {
    const { id } = req.params;
    const actualID = await Base64toId( id)

    const foundmakeProject3Dpsu = await MakeProject3DPSU.findOne(
      
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

    if (!foundmakeProject3Dpsu) {
      return res.status(400).send({
        status: false,
        message: `Data not found`,
      });
    }
    const makeproject3DpsuData = {
      OrganisationID: foundmakeProject3Dpsu.OrganisationID,
      Name_of_Project: foundmakeProject3Dpsu.Name_of_Project ,
      itemCode_PartNo:foundmakeProject3Dpsu.itemCode_PartNo,
      AIP_Date: moment( foundmakeProject3Dpsu.AIP_Date,"YYYY-MM-DD").format("YYYY-MM-DD"),

      EOI_Date: moment( foundmakeProject3Dpsu.EOI_Date,"YYYY-MM-DD").format("YYYY-MM-DD"),
       Withdrawn_On:foundmakeProject3Dpsu.Withdrawn_On? moment( foundmakeProject3Dpsu.Withdrawn_On,"YYYY-MM-DD").format("YYYY-MM-DD"):"",
       Contract_Date:foundmakeProject3Dpsu.Contract_Date?moment( foundmakeProject3Dpsu.Contract_Date,"YYYY-MM-DD").format("YYYY-MM-DD"):"",
    };
    return res.status(200).send({
      status: true,
      message: "Data found successfully",
      data: makeproject3DpsuData,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }

};
const updatemakeProject3Dpsu = async (req, res) => {

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
    const foundMakeProject3Dpsu = await MakeProject3DPSU.findByPk(actualID)
   
    if(!foundMakeProject3Dpsu){
      return res .status(404) .send({status:false, message: "Data not Found"});
    }
    const foundOrganization = await Organization.findByPk(OrganisationID);
    if (!foundOrganization) {
      return res.status(404).send({ status: false, message: "Organization not found" });
    }

    await MakeProject3DPSU.update({
        OrganisationID:OrganisationID,
        itemCode_PartNo:itemCode_PartNo,
        Name_of_Project:Name_of_Project,
        AIP_Date:AIP_Date,
        EOI_Date:EOI_Date,
        Contract_Date:Contract_Date,
        Withdrawn_On:Withdrawn_On,
        ModifiedOn:  new Date(),
        ModifiedBy: req.userId,
        IPAddress: getSystemIPAddress(),
    },
      { where: { M2POFBID:actualID } }
   )
    return res.status(200) .send({staus:true, message: " Data Update Successfully"})
    
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
    
  }
};
const deletemakeProject3Dpsu = async (req, res) => {
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
      await MakeProject3DPSU.update(
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
          message: "Make Project3Dpsu inActive successfully",
        });
    } 
    else if(status=="0"){
      await MakeProject3DPSU.update(
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
          message: "Make Project3Dpsu active successfully",
        });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
module.exports = {
  addmakeProject3DPSU,
  getAllProject3Dpsu,
  getByIDmakeProject3Dpsu,
  updatemakeProject3Dpsu,
  deletemakeProject3Dpsu,
};
