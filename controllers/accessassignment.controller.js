const db = require("../models");
const Access = db.access;
const helper=require("../helper/helper")

const accessAssignment = async (req, res) => {
  try {
    const { UserID, ModuleID } = req.body;
    const userId = req.userId;
    const isAccessExist = await Access.findOne({
      where: {
        UserID: parseInt(UserID),
      },
    });
    if (isAccessExist) {
      await Access.update(
        {
          UserID: isAccessExist?.UserID,
          ModuleID: ModuleID,
          ModifiedOn: new Date(),
          ModifiedBy: userId || "",
        },
        {
          where: {
            UserID:  parseInt(UserID),
          },
        }
      );
      return res
        .status(200)
        .send({ status: true, message: "Allow the accessassignment" });
    } else {
      await Access.create({
        UserID: UserID,
        ModuleID: ModuleID,
        ModifiedOn: new Date(),
        ModifiedBy: userId || "",
      });
      return res
        .status(200)
        .send({ status: true, message: "Allow the accessassignment" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getAccessAssessmentUser=async(req,res)=>{
  try {
    const userId=req.query.userId;
    if(!userId){
      return res.status(400).send({status:true,message:"Please enter userId"});
    }
    const accessData=await Access.findOne({
      where:{
        UserID:userId
      },
      attributes:["UserID","ModuleID"]
    });
    const result={
      userId:accessData?.UserID,
      moduleId:accessData?.ModuleID?JSON.parse(accessData?.ModuleID):"",
      moduleName:accessData?.ModuleID?await helper.getAccessModuleUser(accessData?.ModuleID):""
    }
    return res.status(200).send({status:true,message:"Data found",data:result});
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

module.exports = {
  accessAssignment,
  getAccessAssessmentUser
};
