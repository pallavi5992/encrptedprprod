const db = require("../../models");
const MakeProject2DPSU = db.makeProject2DPSU;
const Organisation = db.organisation;

const chechExists =async(Name_of_Project)=>{
  try {

      const existingRecord= await MakeProject2DPSU.findOne({
          where:{
            Name_of_Project:Name_of_Project,
           
          }
      })
      return !! existingRecord
  } catch (error) {
      console.error("Error checking if record exist ")
     return false
      
  }
}

const addmakeProject2Dpsu = async (req, res, next) => {
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
    if (!OrganisationID) {
        return res
          .status(400)
          .send({ status: false, message: "Please select Organisation!" });
      }
       else if (parseInt(OrganisationID)<0) {
           return res
            .status(400)
            .send({ status: false, message: "Please enter valid Organisation!" });
        }  else if(!itemCode_PartNo){
            return res
            .status(400)
            .send({status: false, message:"Please Enter the itemCode PartNo!"})
        }
    else if(!Name_of_Project){
        return res
        .status(400)
        .send({status: false, message:"Please Enter the Project Name!"})
    }else if(!AIP_Date){
        return res 
        .status(400)
        .send({status: false, message:"Please select Date!"})
    }else if (!EOI_Date){
        return res
        .status(400)
        .send({staus:false, message:"Please select Date!"})
    }else if (!Contract_Date){
        return res
        .status(400)
        .send({staus:false, message:"Please select Date!"})
    }else if (!Withdrawn_On){
        return res
        .status(400)
        .send({staus:false, message:"Please select Date!"})
    }


    const OrgExist = await Organisation.findOne({
      where: {
        OrganisationID: OrganisationID,
      },
    });
    if (!OrgExist) {
      return res
        .status(400)
        .send({ status: false, message: "This is wrong organisation!" });
    }
    const recordExists = await chechExists(Name_of_Project);
    if (recordExists) {
      return res
        .status(400)
        .send({ status: false, message: "Record already exists." });
    }
    next()
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });

  }
};
const updatemakeProject2Dpsu = async (req, res, next) => {
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
    if (!OrganisationID) {
        return res
          .status(400)
          .send({ status: false, message: "Please select Organisation!" });
      }
       else if (parseInt(OrganisationID)<0) {
           return res
            .status(400)
            .send({ status: false, message: "Please enter valid Organisation!" });
        }  else if(!itemCode_PartNo){
            return res
            .status(400)
            .send({status: false, message:"Please Enter the itemCode PartNo!"})
        }
    else if(!Name_of_Project){
        return res
        .status(400)
        .send({status: false, message:"Please Enter the Project Name!"})
    }else if(!AIP_Date){
        return res 
        .status(400)
        .send({status: false, message:"Please select Date!"})
    }else if (!EOI_Date){
        return res
        .status(400)
        .send({staus:false, message:"Please select Date!"})
    }else if (!Contract_Date){
        return res
        .status(400)
        .send({staus:false, message:"Please select Date!"})
    }else if (!Withdrawn_On){
        return res
        .status(400)
        .send({staus:false, message:"Please select Date!"})
    }


    const OrgExist = await Organisation.findOne({
      where: {
        OrganisationID: OrganisationID,
      },
    });
    if (!OrgExist) {
      return res
        .status(400)
        .send({ status: false, message: "This is wrong organisation!" });
    }
    next()
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });

  }
};



module.exports = {
    addmakeProject2Dpsu,
    updatemakeProject2Dpsu,

};