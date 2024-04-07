const db = require("../models");
const MrgsIprTarget = db.mrgsIprtarget;
const {finalyear} =require('../helper/finalYear')




const chechIfmakeProjectExists =async(Organization)=>{
  try {

      const existingRecord= await MrgsIprTarget.findOne({
          where:{
            Organization:Organization,
           
          }
      })
      return !! existingRecord
  } catch (error) {
      console.error("Error checking if record exist ")
     return false
      
  }
}

const addmrgsIprTarget = async (req, res, next) => {
  try {
    const {
      YearID,
      Organization,
      IPRTarget,
 
    } = req.body;
    if (!YearID) {
      return res
        .status(400)
        .send({ status: false, message: "Please select Data year!" });
    } else if (!Organization) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please Enter the Organization!",
        });
    } else if (!IPRTarget) {
      return res
        .status(400)
        .send({ status: false, message: " Please Enter the IPRTarget!" });
    } 
    const recordExists =await chechIfmakeProjectExists(Organization);
    if(recordExists){
      return res 
      .status(400) .send({status: false, message :" Record already exists"})
    }
    const formattedYear = finalyear(YearID); 
    if (!formattedYear) {
      return res.status(400).send({ status: false, message: " Year does not exist" });
    }

    next()
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });

  }
};
const updateMrgesIprTargte = async (req, res, next) => {
  try {
    const {
      YearID,
      Organization,
      IPRTarget,
 
    } = req.body;
    if (!YearID) {
      return res
        .status(400)
        .send({ status: false, message: "Please select Data year!" });
    } else if (!Organization) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please Enter the Organization!",
        });
    } else if (!IPRTarget) {
      return res
        .status(400)
        .send({ status: false, message: " Please Enter the IPRTarget!" });
    } 

    const formattedYear = finalyear(YearID); 
    if (!formattedYear) {
      return res.status(400).send({ status: false, message: " Year does not exist" });
    }

    next()
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });

  }
};

const addmrgsConsolidatedData = async (req, res, next) => {
    try {
      const {
        YearID,
        Organization,
        IPRTarget,
        IPRFiled,
        IPRGranted,
        ModifiedOn
  
   
      } = req.body;
      if (!YearID) {
        return res
          .status(400)
          .send({ status: false, message: "Please select Data year!" });
      } else if (!Organization) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Please Enter the Organization!",
          });
      } else if (!IPRTarget) {
        return res
          .status(400)
          .send({ status: false, message: " Please Enter the IPRTarget!" });
      } else if (!IPRFiled) {
          return res
            .status(400)
            .send({ status: false, message: " Please Enter the IPRFiled!" });
        } else if (!IPRGranted) {
          return res
            .status(400)
            .send({ status: false, message: " Please Enter the IPRGranted!" });
        } 
        else if (!ModifiedOn) {
          return res
            .status(400)
            .send({ status: false, message: " Please Enter the AS on Date" });
        } 
        const recordExists =await chechIfmakeProjectExists(Organization);
        if(recordExists){
          return res 
          .status(400) .send({status: false, message :" Record already exists"})
        }
        const formattedYear = finalyear(YearID); 
        if (!formattedYear) {
          return res.status(400).send({ status: false, message: " Year does not exist" });
        }
      next()
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
  
    }
  };
  const updateConsolidatedData = async (req, res, next) => {
      try {
        const {
          YearID,
          Organization,
          IPRTarget,
          IPRFiled,
          IPRGranted, 
          ModifiedOn,
     
        } = req.body;
        if (!YearID) {
          return res
            .status(400)
            .send({ status: false, message: "Please Enter data year!" });
        }
        else if (!Organization) {
          return res
            .status(400)
            .send({ status: false, message: "Please select Organization" });
        } else if (!IPRTarget) {
          return res.status(400).send({
            status: false,
            message: "Please Enter IPRTarget!",
          });
        } else if (!IPRFiled) {
          return res.status(400).send({
            status: false,
            message: "Please Enter IPRFiled!",
          });
        } else if (!IPRGranted) {
          return res.status(400).send({
            status: false,
            message: "Please Enter IPRGranted!",
          });
        }  else if (! ModifiedOn) {
          return res.status(400).send({
            status: false,
            message: "Please Enter As on Date!",
          });
        } 
   
        const formattedYear = finalyear(YearID); 
        if (!formattedYear) {
          return res.status(400).send({ status: false, message: " Year does not exist" });
        }
       next();
      } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
      }
  };

module.exports = {
    addmrgsIprTarget,
    updateMrgesIprTargte,
    addmrgsConsolidatedData,
    updateConsolidatedData
};