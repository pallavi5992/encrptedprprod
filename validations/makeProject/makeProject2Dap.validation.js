const db = require("../../models");
const MakeProject2DAP = db.makeProject2DAP;



const checkIfProdExists = async (Name_of_Project) => {
    try {
      const existingRecord = await MakeProject2DAP.findOne({
        where: {
            Name_of_Project: Name_of_Project,
        },
      });
  
      return !!existingRecord; // Return true if the record exists, false otherwise
    } catch (error) {
      console.error("Error checking if record exists:", error);
      return false;
    }
  };
const addmakeProject2DAP= async(req, res, next)=>{
    try {
      const{
        SHQ,
        Name_of_Project,
        AIP_Date,
        AON_Date,
        PSO_Date,
        Withdrawn_On,
      }=req.body;

      if(!SHQ){
        return res
        .status(400)
        .send({status:false, message:"Please select SHQ!"});
      }
      else if(!Name_of_Project){
        return res
        .status(400)
        .send({status: false, message:"Please Enter the Project Name!"})
    }else if(!AIP_Date){
        return res 
        .status(400)
        .send({status: false, message:"Please select Date!"})
    }else if (!AON_Date){
        return res
        .status(400)
        .send({staus:false, message:"Please select Date!"})
    }else if (!PSO_Date){
        return res
        .status(400)
        .send({staus:false, message:"Please select Date!"})
    }else if (!Withdrawn_On){
        return res
        .status(400)
        .send({staus:false, message:"Please select Date!"})
    }
    const recordExists = await checkIfProdExists(Name_of_Project);
    if (recordExists) {
      return res
        .status(400)
        .send({ status: false, message: "Record already exists." });
    }
    next()
    } catch (error) {
        
    }
}

const updatemakeProject2DAP= async(req, res, next)=>{
    try {
      const{
        SHQ,
        Name_of_Project,
        AIP_Date,
        AON_Date,
        PSO_Date,
        Withdrawn_On,
      }=req.body;

      if(!SHQ){
        return res
        .status(400)
        .send({status:false, message:"Please select SHQ!"});
      }else if(!Name_of_Project){
        return res
        .status(400)
        .send({status: false, message:"Please Enter the Project Name!"})
    }else if(!AIP_Date){
        return res 
        .status(400)
        .send({status: false, message:"Please select Date!"})
    }else if (!AON_Date){
        return res
        .status(400)
        .send({staus:false, message:"Please select Date!"})
    }else if (!PSO_Date){
        return res
        .status(400)
        .send({staus:false, message:"Please select Date!"})
    }else if (!Withdrawn_On){
        return res
        .status(400)
        .send({staus:false, message:"Please select Date!"})
    }
    next()
    } catch (error) {
        
    }
}
module.exports={
    addmakeProject2DAP,
    updatemakeProject2DAP
}