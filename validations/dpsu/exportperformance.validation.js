const db = require("../../models");
const Export = db.exportperformance;
const FyYear = db.tblYear
const Organisation= db.organisation

const checkIfExportExists = async (OrganisationID,FyYearID, Month) => {
  try {
    const existingRecord = await Export.findOne({
      where: {
        OrganisationID: OrganisationID,
        YearID: FyYearID,
        SelectedMonth: Month,
      },
    });

    return !!existingRecord; // Return true if the record exists, false otherwise
  } catch (error) {
    console.error('Error checking if record exists:', error);
    return false;
  }
};

const exportperformanceData = async (req, res, next) => {
    try {
      const { OrganisationID,FyYearID,ExportValue,ExportOrBook,Month, Remarks } = req.body;
      if (!OrganisationID) {
        return res
          .status(400)
          .send({ status: false, message: "Please select organisation" });
      }else if (!FyYearID) {
        return res.status(400).send({
          status: false,
          message: "Please select FY year!",
        });
      } else if (!ExportValue) {
        return res.status(400).send({
          status: false,
          message: "Please Enter Value Of Export Value!",
        });
      } else if (!ExportOrBook) {
        return res.status(400).send({
          status: false,
          message: "Please Enter Export Order Book!!",
        });
      } else if (!Month) {
        return res.status(400).send({
            status: false,
            message: "Please select month year!",
          });
      } else if (!Remarks) {
        return res.status(400).send({
          status: false,
          message: "Please Enter Remarks!",
        });
      }
      const OrgExist = await Organisation.findOne({
          where: {
              OrganisationID: OrganisationID,     
          },
        });
        if (!OrgExist) {
          return res
            .status(400)
            .send({ status: false, message: "Organisation not exist" });
        }
      const FyYearExist = await FyYear.findOne({
          where: {
              YearID : FyYearID,
          },
        });
        if (!FyYearExist) {
          return res
            .status(400)
            .send({ status: false, message: "Financial Year not exist" });
        }
     
        const recordExists = await checkIfExportExists(OrganisationID,FyYearID, Month);
        if (recordExists) {
          return res
          .status(400)
          .send({ status: false, message: "Record already exists." });
        } 
          next();
  
          
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };

  module.exports = {
    exportperformanceData,
  };
  
  