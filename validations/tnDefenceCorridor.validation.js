const db = require("../models");
const Organisation = db.organisation;
const TndefenceCorridor = db.tndefenceCorridor;

const checkIfProdExists = async (Project) => {
    try {
      const existingRecord = await TndefenceCorridor.findOne({
        where: {
            Project:Project,
           
        },
      });
      
      return !!existingRecord; // Return true if the record exists, false otherwise
    } catch (error) {
      console.error('Error checking if record exists:', error);
      return false;
    }
  };

const addTndefencecorridor =async(req, res, next)=>{
    try {
        const{ 
           
          Sector,
          OrganisationID,
          Investment,
          Project
        }=req.body
            if(!Sector){
                return res
                .status(400)
                .send({status:false, message:"Please select Sector!"});
              }else if(!OrganisationID){
                return res
                .status(400)
                .send({status: false, message:"Please select Organisation!"})
            }
            else if (parseInt(OrganisationID)<0) {
                return res
                 .status(400)
                 .send({ status: false, message: "Please enter valid Organisation!" });
             }else if(!Investment){
                return res 
                .status(400)
                .send({status: false, message:"Please Enter Investment!"})
            }else if (!Project){
                return res
                .status(400)
                .send({status:false, message:"Please Enter the Project Description!"})
            }
            
    const recordExists = await checkIfProdExists(Project);
    if (recordExists) {
      return res
      .status(400)
      .send({ status: false, message: "Record already exists." });
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
                return res .status(500) .send({status:false , message:error.message})
                
            }
}

const updateTndefencecorridor =async(req, res, next)=>{

    try {
        const{ 
           
          Sector,
          OrganisationID,
          Investment,
          Project
        }=req.body
            if(!Sector){
                return res
                .status(400)
                .send({status:false, message:"Please select Sector!"});
              }else if(!OrganisationID){
                return res
                .status(400)
                .send({status: false, message:"Please select Organisation!"})
            }
            else if (parseInt(OrganisationID)<0) {
                return res
                 .status(400)
                 .send({ status: false, message: "Please enter valid Organisation!" });
             }else if(!Investment){
                return res 
                .status(400)
                .send({status: false, message:"Please Enter Investment!"})
            }else if (parseFloat(Investment)<0){
                   return res .status(400) .send({status:false , message:"Please enter the value"})

            }else if (!Project){
                return res
                .status(400)
                .send({status:false, message:"Please Enter the Project Description!"})
            }
            


            next()
            } catch (error) {
                return res .status(500) .send({status:false , message:error.message})
                
            }

}
const addTnInvestmentDefecneCorridor =async(req, res, next)=>{
    try {
        const{ 
           
            InvestmentTarget,
            InvestmentMade,
            AS_On_Date,
        }=req.body
            if(!InvestmentTarget){
                return res
                .status(400)
                .send({status:false, message:"Please Enter Investment Target!"});
              }else if(!InvestmentMade){
                return res
                .status(400)
                .send({status: false, message:"Please Enter Investment Made so far!"})
            }else if(!AS_On_Date){
                return res 
                .status(400)
                .send({status: false, message:"Please select As on Date!"})
            }
            next()
            } catch (error) {
                return res .status(500) .send({status:false , message:error.message})
                
            }
}

module.exports={
    addTndefencecorridor,
    addTnInvestmentDefecneCorridor,
    updateTndefencecorridor

}