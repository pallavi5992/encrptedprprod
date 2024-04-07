const db = require("../models");
const Organisation = db.organisation;
const addorganisation = async (req, res, next) => {

  try {
  
    const {
        Code,
        Name,
      } = req.body;
    if (!Code) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter code" });
    } else if (!Name) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Organisation Short Name!" });
    } 

     next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const deleteOrganisation=async(req,res,next)=>{
    try {
        const { OrganisationID } = req.params;
        await Organisation.findOne({
        where:{
            OrganisationID: OrganisationID,
          Deleted:"0"
        }
      })
      if(user){
        return res.status(400).send({ status: false, message: "User not found" });
      };
      next()
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
module.exports = {
    addorganisation,
    deleteOrganisation

  };
  


