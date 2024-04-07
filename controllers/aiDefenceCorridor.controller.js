const db = require("../models");    
const AIdefenceCorridor = db.aidefenceCorridor;
const { getSystemIPAddress } = require("../helper/systemIp");
const helperorg=require("../helper/helper")
const { finalyear,months } = require("../helper/finalYear");

const { Base64toId, idIntoBase64 } = require("../helper/idIntoBase64");

const addAidefencecorridor = async (req, res) => {     
  try {
    const{
      YearID,
      OrganisationID,
      Project,
      Completed
    }=req.body
    const userId = req.userId;

  await AIdefenceCorridor.create({   
    YearID:YearID,
    OrganisationID:OrganisationID,
    Project:Project,
    Completed:Completed,
    Deleted:"0",
    ModifiedOn:new Date(),
    ModifiedBy: userId,
    IPAddress:getSystemIPAddress(),
  })
  return res.status(200).send({status:true, message:"Data added Successfully"})
  } catch (error) {
    return res .status(500).send({status:false, messsage:error.message})
    
  }

};
const getAllAidefencecorridor = async (req, res) => {
  try {
    const AiDefenceCorridorData  =[]
    const foundata =await AIdefenceCorridor.findAll({
      attributes:[
        "AIID",
        "YearID",
        "OrganisationID",
        "Project",
        "Completed",
        "Deleted"
  
      ]
    })
    for(let i=0; i<foundata.length; i++){
  
      const encryptId =await idIntoBase64(foundata[i].AIID)
      AiDefenceCorridorData.push({
        Id:encryptId,  
        YearID: finalyear(foundata[i].YearID),  

        // YearID:foundata[i].YearID,
        OrganisationID:foundata[i].OrganisationID?await helperorg.organisationName(foundata[i].OrganisationID):"",
        Project:foundata[i].Project,
        Completed:foundata[i].Completed,
        status:foundata[i].Deleted,
  })
    }
    return res .status(200) .send({status:false, message:"Data Found", data:AiDefenceCorridorData})
  } catch (error) {
    return res .status(500) .send({status:false, mesage:error.message})
  }
};

const getByIdAidefencecorridor = async (req, res) => {
try {
  const {id}=req.params
const actualID =await Base64toId(id) 

  const foundatabyId= await AIdefenceCorridor.findOne(
    {   where:{
      AIID:actualID
    },
    attributes:[

      "YearID",
      "OrganisationID",
      "Project",
      "Completed",
]}
)
if(!foundatabyId){
  return res .status(400) .send({status:false, message: `Data not found`})
}

const AidefenceData ={
  YearID:foundatabyId.YearID,
  OrganisationID:foundatabyId.OrganisationID,
  Project:foundatabyId.Project,
  Completed:foundatabyId.Completed
}
return res .status(200) .send({status:true, message:"Data found successfully",data:AidefenceData})

} catch (error) {
  return res .status(500) .send({status:false, message:error.message})
  
}
  
};
const updateAidefencecorridor  = async (req, res) => {
  try {
    const{id} = req.params
    const actualID = await Base64toId(id)
    const{
      YearID,
      OrganisationID,
      Project,
      Completed
    } = req.body
    const foundata = await AIdefenceCorridor.findByPk(actualID)
    if(!foundata){
      return res .status(400) .send({status:false, message:"data not Found"})
    }
         await AIdefenceCorridor.update({
          YearID:YearID,
          OrganisationID:OrganisationID,
          Project:Project,
          Completed:Completed,
          ModifiedOn: new Date(),
          ModifiedBy:req.userId,
          IPAddress:getSystemIPAddress()
        },
        { where:{
          AIID:actualID
        },})
        return res .status(200) .send({status:true,mesage:"Data Update Successfully"})
    
  } catch (error) {
    return res .status(500) .send({status:false , mesage:error.mesage})
    
  }


};
const deleteAidefencecorridor  = async (req, res) => {
  try {
  const{id}=req.params
  const status =req.query.status;
  const actualID = await Base64toId(id)
  if(!status){
    return res .status(400) .send({status:fasle , message:"Please enter status"});
  }
  if(status=="1"){
    await AIdefenceCorridor .update(
      { Deleted:status,},
      {where:{
        AIID:actualID        
      },
    }
    );
    return res .status(200).send({status:true, message:"Ai Defence Corridor InActive Successfully"})

  }
  else if(status=="0"){
    await AIdefenceCorridor.update(
      {
        Deleted: status,
      },
      {
        where:{
          AIID:actualID        


        }
      }
    );
    return res .status(200) .send({ status:true , mesage:"Ai Defecne Corridor active successfully"})
  }
    
  } catch (error) {
  return res .status(500) .send({stattus:false, messsage:error.mesage})
    
  }

};
module.exports = {
    addAidefencecorridor,   
    getAllAidefencecorridor,
    getByIdAidefencecorridor,
    updateAidefencecorridor,
    deleteAidefencecorridor,
};
