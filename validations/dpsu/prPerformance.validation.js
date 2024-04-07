const db = require("../../models");
const prProduction = db.prProduction;
const FyYear = db.tblYear
const Organisation= db.organisation
const jwt = require("jsonwebtoken");
const { encryptToToken,encryptData,decryptData} = require("../../helper/idIntoBase64");

const checkIfDataExists = async (encryptedOrganisationID,encryptedYearID,encryptedQuarter) => {
  try {
    const recordExists = await prProduction.findOne({
      where: {
        OrganisationID: encryptedOrganisationID.encryptedData + '.' + encryptedOrganisationID.key + '.' + encryptedOrganisationID.iv,
     
        YearID: encryptedYearID.encryptedData + '.' + encryptedYearID.key + '.' + encryptedYearID.iv,
        Quarter: encryptedQuarter.encryptedData + '.' + encryptedQuarter.key + '.' + encryptedQuarter.iv,
      }
    });

    return !!recordExists; 
  } catch (error) {
    console.error('Error checking if data exists:', error);
    return false;
  }
};
const addprPerformance = async (req, res, next) => {
  try {
    const { OrganisationID, Cumulative, YearID, Quarter, Remarks } = req.body;
    if (!OrganisationID) {
      return res
        .status(400)
        .send({ status: false, message: "Please select organisation" });
    } else if (!Cumulative) {
      return res.status(400).send({
        status: false,
        message: "Please Enter Cumulative!",
      });
    } else if (!YearID) {
      return res.status(400).send({
        status: false,
        message: "Please select data year!",
      });
    } else if (!Quarter) {
      return res.status(400).send({
        status: false,
        message: "Please select Quarter!",
      });
    } else if (!Remarks) {
      return res.status(400).send({
        status: false,
        message: "Please Enter Remarks!",
      });
    }

    const OrganisationIDString = OrganisationID.toString();
    const YearIDString = YearID.toString();
    const QuarterString = Quarter.toString();
    const encryptedOrganisationID = encryptData(OrganisationIDString);
    const encryptedYearID = encryptData(YearIDString);
    const encryptedQuarter = encryptData(QuarterString);

    const { encryptedData: orgEncryptedData, key: orgKey, iv: orgIV } = encryptedOrganisationID;
    const { encryptedData: yearEncryptedData, key: yearKey, iv: yearIV } = encryptedYearID;
    const { encryptedData: quarterEncryptedData, key: quarterKey, iv: quarterIV } = encryptedQuarter;

    // Decrypt the encrypted data
    const decryptedOrganisationID = decryptData({ encryptedData: orgEncryptedData, key: orgKey, iv: orgIV });
    const decryptedYearID = decryptData({ encryptedData: yearEncryptedData, key: yearKey, iv: yearIV });
    const decryptedQuarter = decryptData({ encryptedData: quarterEncryptedData, key: quarterKey, iv: quarterIV });
console.log(decryptedOrganisationID,"------", decryptedYearID,"----",decryptedQuarter )
    const OrgExist = await Organisation.findOne({
        where: {
            OrganisationID: decryptedOrganisationID,
        },
      });
      if (!OrgExist) {
        return res
          .status(400)
          .send({ status: false, message: "Organisation not exist" });
      }
    const FyYearExist = await FyYear.findOne({
        where: {
            YearID : decryptedYearID,
        },
      });
      if (!FyYearExist) {
        return res
          .status(400)
          .send({ status: false, message: "Financial Year not exist" });
      }

      console.log(decryptedQuarter,"decryptedQuarter##@@@@#")
      const quarter = [1,2,3,4]
      const checkquarter = quarter.includes(parseInt(decryptedQuarter))

      if(!checkquarter){
        return res
        .status(400)
        .send({ status: false, message: "Invalid Quarter" });
      }
  
     

        next();
   
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


const updateprPerformance = async (req,res,next)=>{
try{
  const { OrganisationID, Cumulative ,YearID, Quarter, Remarks } = req.body;
  if (!OrganisationID) {
    return res
      .status(400)
      .send({ status: false, message: "Please select organisation" });
  } else if (!Cumulative ) {
    return res.status(400).send({
      status: false,
      message: "Please Enter Cumulative !",
    });
  } else if (!YearID) {
    return res.status(400).send({
      status: false,
      message: "Please select data year!",
    });
  } else if (!Quarter) {
    return res.status(400).send({
      status: false,
      message: "Please select Quarter!",
    });
  } else if (!Remarks) {
    return res.status(400).send({
      status: false,
      message: "Please Enter Remarks!",
    });
  }
  const OrganisationIDString = OrganisationID.toString();
  const YearIDString = YearID.toString();
  const QuarterString = Quarter.toString();
  const encryptedOrganisationID = encryptData(OrganisationIDString);
  const encryptedYearID = encryptData(YearIDString);
  const encryptedQuarter = encryptData(QuarterString);

  const { encryptedData: orgEncryptedData, key: orgKey, iv: orgIV } = encryptedOrganisationID;
  const { encryptedData: yearEncryptedData, key: yearKey, iv: yearIV } = encryptedYearID;
  const { encryptedData: quarterEncryptedData, key: quarterKey, iv: quarterIV } = encryptedQuarter;

  // Decrypt the encrypted data
  const decryptedOrganisationID = decryptData({ encryptedData: orgEncryptedData, key: orgKey, iv: orgIV });
  const decryptedYearID = decryptData({ encryptedData: yearEncryptedData, key: yearKey, iv: yearIV });
  const decryptedQuarter = decryptData({ encryptedData: quarterEncryptedData, key: quarterKey, iv: quarterIV });
console.log(decryptedOrganisationID,"------", decryptedYearID,"----",decryptedQuarter )
  const OrgExist = await Organisation.findOne({
      where: {
          OrganisationID: decryptedOrganisationID,
      },
    });
    if (!OrgExist) {
      return res
        .status(400)
        .send({ status: false, message: "Organisation not exist" });
    }
  const FyYearExist = await FyYear.findOne({
      where: {
          YearID : decryptedYearID,
      },
    });
    if (!FyYearExist) {
      return res
        .status(400)
        .send({ status: false, message: "Financial Year not exist" });
    }

    
    const quarter = [1,2,3,4]
    const checkquarter = quarter.includes(parseInt(decryptedQuarter))

    if(!checkquarter){
      return res
      .status(400)
      .send({ status: false, message: "Invalid Quarter" });
    }
console.log("nextttttttt")
      next();
} catch (error) {
  return res.status(500).send({ status: false, message: error.message });
}
}
module.exports = {
  addprPerformance,
  updateprPerformance
};
