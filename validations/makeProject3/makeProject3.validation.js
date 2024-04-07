const {months}=require("../../helper/finalYear")
const MakeProject3 = db.makeProject3;


const chechIfmakeProjectExists =async(AIP_Accorded_DPP)=>{
    try {

        const existingRecord= await MakeProject3.findOne({
            where:{
                AIP_Accorded_DPP:AIP_Accorded_DPP,
            }
        })
        return !! existingRecord
    } catch (error) {
        console.error("Error checking if record exist ")
       return false
        
    }
}
const addmakeProject3= async(req, res, next)=>{
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
        return res.status(400)
        .send({status:false, message:"Please select Year!"});
      } else if(!MonthID){
        return res.status(400)
        .send({status: false, message:"Please select Month!"})
    }else if(!AIP_Accorded_DPP){
        return res 
        .status(400)
        .send({status: false, message:"Please select the AIP Accorded (DPP)!"})
    }else if (!AIP_Dropped_DPP){
        return res
        .status(400)
        .send({staus:false, message:"Please select the AIP Dropped (DPP)!"})
    }else if (!AIP_Accorded_OFB){
        return res
        .status(400)
        .send({staus:false, message:"Please select the AIP Accorded (DPSUs)!"})
    }else if (!AIP_Dropped_OFB){
        return res
        .status(400)
        .send({staus:false, message:"Please select AIP Dropped (DPSUs)!"})
    }


    const recordExists =await chechIfmakeProjectExists(AIP_Accorded_DPP);
    if(recordExists){
      return res 
      .status(400) .send({status: false, message :" Record already exists"})
    }
    
    const monthsExistingCheck = months(MonthID) 
    if (!monthsExistingCheck){
      return  res .status(400).send({status:false, message:"this Month is not existing"})

    }
    next()
    } catch (error) {
        return res.status(500).send({staus:false, message:error.message})
    }
}
const updatemakeProject3= async(req, res, next)=>{
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
          return res.status(400)
          .send({status:false, message:"Please select Year!"});
        } else if(!MonthID){
          return res.status(400)
          .send({status: false, message:"Please select Month!"})
      }else if(!AIP_Accorded_DPP){
          return res 
          .status(400)
          .send({status: false, message:"Please select the AIP Accorded (DPP)!"})
      }else if (!AIP_Dropped_DPP){
          return res
          .status(400)
          .send({staus:false, message:"Please select the AIP Dropped (DPP)!"})
      }else if (!AIP_Accorded_OFB){
          return res
          .status(400)
          .send({staus:false, message:"Please select the AIP Accorded (DPSUs)!"})
      }else if (!AIP_Dropped_OFB){
          return res
          .status(400)
          .send({staus:false, message:"Please select AIP Dropped (DPSUs)!"})
      }
  
  

      
      const monthsExistingCheck = months(MonthID) 
      if (!monthsExistingCheck){
        return  res .status(400).send({status:false, message:"this Month is not existing"})
  
      }
      next()
      } catch (error) {
          return res.status(500).send({staus:false, message:error.message})
      }
}
module.exports={
    addmakeProject3,
    updatemakeProject3
}