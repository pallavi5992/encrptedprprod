const db = require('../models')
const adddefenceProduction= async(req, res, next)=>{
    try {
      const{
        YearID,
        DPSU,
        OFB,
        Other_PSU,
        Defence_Private_Companies,
        ModifiedOn,
      }=req.body;

      if(!YearID){
        return res
        .status(400)
        .send({status:false, message:"Please select Year!"});
      }else if(!DPSU){
        return res
        .status(400)
        .send({status: false, message:"Please select the DPSU!"})
    }else if(!OFB){
        return res 
        .status(400)
        .send({status: false, message:"Please select the 7 new of companies!"})
    }else if (!Other_PSU){
        return res
        .status(400)
        .send({staus:false, message:"Please select the other PSU!"})
    }else if (!Defence_Private_Companies){
        return res
        .status(400)
        .send({staus:false, message:"Please select the other PSU!"})
    }else if (!ModifiedOn){
        return res
        .status(400)
        .send({staus:false, message:"Please select the As on Date!"})
    }
    next()
    } catch (error) {
        
    }
}
module.exports={
    adddefenceProduction
}