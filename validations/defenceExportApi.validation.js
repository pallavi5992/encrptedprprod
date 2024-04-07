const db = require("../models");
const DefeceExportAPI = db.defenceExportApi;
const { Op } = require("sequelize");
const {finalyear} =require('../controllers/defenceExportApi.controller')
const checkIfProfitExists = async (fin_year,dpsu) => {
  try {
    const existingRecord = await DefeceExportAPI.findOne({
      where: {
        fin_year: fin_year,
        dpsu: {
          [Op.eq]:dpsu,
        },
      },
    });
      
console.log(existingRecord);
    return !!existingRecord; // Return true if the record exists, false otherwise
  } catch (error) {
    console.error('Error checking if record exists:', error);
    return false;
  }
};
const addDefenceExportApiConfig = async (req, res, next) => {
  try {
    const {
      fin_year,
      dpsu,
      cmy_cat,
      privatecompanies,
      rdate,
      ContractValue,
    } = req.body;
    if (!fin_year) {
      return res
        .status(400)
        .send({ status: false, message: "Please select Data year!" });
    } else if (!dpsu) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please Enter the Export By DPSU/OFB!",
        });
    } else if (!cmy_cat) {
      return res
        .status(400)
        .send({ status: false, message: " Please Enter the Scomet!" });
    } else if(!privatecompanies){
        return res
        .status(400)
        .send ({ status : false, message : "Please Enter the Privatecompanies!"})
    }else if(!ContractValue){
         return res 
         .status(400)
         .send({status : false ,message : " Plase Enter the Contract value"})

    }else if(!rdate){
          return res
          .status(400)
          .send({ status:false, message: "Select the Date!"})
    }


    const formattedYear = finalyear(fin_year); 
    if (!formattedYear) {
      return res.status(400).send({ status: false, message: " Year does not exist" });
    }

    const recordExists = await checkIfProfitExists( fin_year,dpsu );
    if (recordExists) {
      return res
      .status(400)
      .send({ status: false, message: "Record already exists." });
    } 
    next()
  } catch (error) {}
};

module.exports = {
  addDefenceExportApiConfig,
};
