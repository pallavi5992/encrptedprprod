const db = require("../../models");
const prProduction = db.gemPerformance;
const Organisation= db.organisation
const gemPerformance = db.gemPerformance;

const checkIfProdExists = async (OrganisationID, CurrentFY, Procurement, SelectedMonth) => {
    try {
      const existingRecord = await gemPerformance.findOne({
        where: {
            OrganisationID: OrganisationID,
            CurrentFY: CurrentFY,
            Procurement: Procurement,
            SelectedMonth:SelectedMonth
        },
      });
  
      return !!existingRecord; // Return true if the record exists, false otherwise
    } catch (error) {
      console.error('Error checking if record exists:', error);
      return false;
    }
  };

const addgemPerformanceData = async (req, res, next) => {
    try {
        const { OrganisationID, CurrentFY, Procurement, Percentage,SelectedMonth, Remarks } = req.body;
      if (!OrganisationID) {
        return res
          .status(400)
          .send({ status: false, message: "Please select organisation" });
      } else if (!CurrentFY) {
        return res.status(400).send({
          status: false,
          message: "Please Enter procurement Target for current F.Y.",
        });
      } else if (!Procurement) {
        return res.status(400).send({
          status: false,
          message: "Please Enter Procurement made through GeM as on date",
        });
      } else if (!Percentage) {
        return res.status(400).send({
          status: false,
          message: "Please Enter Percentage!",
        });
      }  else if (!SelectedMonth) {
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
        if (!/^\d{4}-\d{2}$/.test(SelectedMonth)) {
            return res
              .status(400)
              .send({ status: false, message: "Please Enter Valid Date" });
          }
        const recordExists = await checkIfProdExists(OrganisationID, CurrentFY, Procurement, SelectedMonth);
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
    addgemPerformanceData
  };
  