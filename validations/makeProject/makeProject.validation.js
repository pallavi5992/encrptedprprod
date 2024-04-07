const db = require('../../models')
const FyYear =db.tblYear
const MakeProject = db.makeProject;
const {months}=require("../../helper/finalYear")



const chechIfmakeProjectExists =async(AIP_Accorded_DPP,AIP_Dropped_DPP)=>{
    try {

        const existingRecord= await MakeProject.findOne({
            where:{
                AIP_Accorded_DPP:AIP_Accorded_DPP,
                AIP_Dropped_DPP:AIP_Dropped_DPP
            }
        })
        return !! existingRecord
    } catch (error) {
        console.error("Error checking if record exist ")
       return false
        
    }
}
const addmakeProject= async(req, res, next)=>{
    try {
      const{
        YearID,
        MonthID,
        AIP_Accorded_DPP,
        AIP_Dropped_DPP,
        AIP_Accorded_OFB,
        AIP_Dropped_OFB,
      }=req.body;

      if(!YearID){
        return res
        .status(400)
        .send({status:false, message:"Please select Year!"});
      }else if(!MonthID){
        return res
        .status(400)
        .send({status: false, message:"Please select Month!"})
    }else if(!AIP_Accorded_DPP){
        return res 
        .status(400)
        .send({status: false, message:"Please select the AIP Accorded (DPP)!"})
    }else if(parseInt(AIP_Accorded_DPP<0)){
        return res .status(400) .send({status:false, message:"Please enter valid AIP_Accorded_DPP"})
    }
    else if (!AIP_Dropped_DPP){
        return res
        .status(400)
        .send({staus:false, message:"Please select the AIP Dropped (DPP)!"})
    }
    else if(parseInt(AIP_Dropped_DPP<0)){
        return res .status(400) .send({status:false, message:"Please enter valid AIP_Dropped_DPP"})
    }
    else if (!AIP_Accorded_OFB){
        return res
        .status(400)
        .send({staus:false, message:"Please select the AIP Accorded (DPSUs)!"})
    }
    else if(parseInt(AIP_Accorded_OFB<0)){
        return res .status(400) .send({status:false, message:"Please enter valid AIP_Accorded_OFB"})
    }else if (!AIP_Dropped_OFB){
        return res
        .status(400)
        .send({staus:false, message:"Please select AIP Dropped (DPSUs)!"})
    }else if(parseInt(AIP_Dropped_OFB<0)){
        return res .status(400) .send({status:false, message:"Please enter valid AIP_Dropped_OFB"})
    }

    const FyYearExist = await FyYear.findOne({
        where: {
            YearID : YearID,
        },
      });
      if (!FyYearExist) {
        return res
          .status(400)
          .send({ status: false, message: "This Year not exist" });
      }

      const monthsExistingCheck = months(MonthID) 
      if (!monthsExistingCheck){
        return  res .status(400).send({status:false, message:"this Month is not existing"})

      }

      

      const recordExists =await chechIfmakeProjectExists(AIP_Accorded_DPP);
      if(recordExists){
        return res 
        .status(400) .send({status: false, message :" Record already exists"})
      }
    next()
    } catch (error) {
        return res
        .status(500)
        .send({staus:false, message:error.message})
    }
}
const updatemakeProject= async(req, res, next)=>{
    try {
      const{
        YearID,
        MonthID,
        AIP_Accorded_DPP,
        AIP_Dropped_DPP,
        AIP_Accorded_OFB,
        AIP_Dropped_OFB,
      }=req.body;

      if(!YearID){
        return res
        .status(400)
        .send({status:false, message:"Please select Year!"});
      }else if(!MonthID){
        return res
        .status(400)
        .send({status: false, message:"Please select Month!"})
    }else if(!AIP_Accorded_DPP){
        return res 
        .status(400)
        .send({status: false, message:"Please select the AIP Accorded (DPP)!"})
    }else if(parseInt(AIP_Accorded_DPP<0)){
        return res .status(400) .send({status:false, message:"Please enter valid AIP_Accorded_DPP"})
    }
    else if (!AIP_Dropped_DPP){
        return res
        .status(400)
        .send({staus:false, message:"Please select the AIP Dropped (DPP)!"})
    }
    else if(parseInt(AIP_Dropped_DPP<0)){
        return res .status(400) .send({status:false, message:"Please enter valid AIP_Dropped_DPP"})
    }
    else if (!AIP_Accorded_OFB){
        return res
        .status(400)
        .send({staus:false, message:"Please select the AIP Accorded (DPSUs)!"})
    }
    else if(parseInt(AIP_Accorded_OFB<0)){
        return res .status(400) .send({status:false, message:"Please enter valid AIP_Accorded_OFB"})
    }else if (!AIP_Dropped_OFB){
        return res
        .status(400)
        .send({staus:false, message:"Please select AIP Dropped (DPSUs)!"})
    }else if(parseInt(AIP_Dropped_OFB<0)){
        return res .status(400) .send({status:false, message:"Please enter valid AIP_Dropped_OFB"})
    }

    const FyYearExist = await FyYear.findOne({
        where: {
            YearID : YearID,
        },
      });
      if (!FyYearExist) {
        return res
          .status(400)
          .send({ status: false, message: "This Year not exist" });
      }

      const monthsExistingCheck = months(MonthID) 
      if (!monthsExistingCheck){
        return  res .status(400).send({status:false, message:"this Month is not existing"})

      }
    next()
    } catch (error) {
        return res
        .status(500)
        .send({staus:false, message:error.message})
    }
}



module.exports={
    addmakeProject,
    updatemakeProject
}