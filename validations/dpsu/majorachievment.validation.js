const db = require("../../models");
const FyYear = db.tblYear;
const Major = db.majorachievments;
const Organisation = db.organisation;

const checkIfMajorExists = async (organisationID) => {
  try {
    const existingRecord = await Major.findOne({
      where: {
        OrganisationID: organisationID,
      },
    });

    return !!existingRecord; // Return true if the record exists, false otherwise
  } catch (error) {
    console.error("Error checking if record exists:", error);
    return false;
  }
};
const addmajorachievmentData = async (req, res, next) => {
  try {
    const {
      OrganisationID,
      Achievement,
      ValueInCr,
      SelectedMonth,
      Remarks,
    } = req.body;
    if (!OrganisationID) {
      return res
        .status(400)
        .send({ status: false, message: "Please select organisation" });
    } else if (!Achievement) {
        return res.status(400).send({
          status: false,
          message: "Please select data Major Achievement!",
        });
      }else if (!ValueInCr) {
        return res.status(400).send({
          status: false,
          message: "Please Enter Value in Cr!",
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
    const recordExists = await checkIfMajorExists(
      OrganisationID
    );
    if (recordExists) {
      return res
        .status(400)
        .send({ status: false, message: "Record already exists." });
    }
  
    next();
  } catch (error) {
    return res.status(400).send({ status: false, message: error.message });
  }
};

module.exports = {
    addmajorachievmentData,
};
