const db = require("../../models");
const FyYear = db.tblYear;
const MordenP = db.modernisationprojects;
const Organisation = db.organisation;


const checkIfMordenExists = async (organisationID) => {
  try {
    const existingRecord = await MordenP.findOne({
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
const modernisationprojectsData = async (req, res, next) => {
  try {
    const {
      OrganisationID,
      MajorProjects,
      ValueCr,
      StartDate,
      CompletionDate,
      Financial,
      Pysical,
      Remarks,
    } = req.body;
    if (!OrganisationID) {
      return res
        .status(400)
        .send({ status: false, message: "Please select organisation" });
    } else if (!MajorProjects) {
        return res.status(400).send({
          status: false,
          message: "Please Enter Major Projects!",
        });
      }else if (!ValueCr) {
        return res.status(400).send({
          status: false,
          message: "Please Enter Value in Cr.!",
        });
      }else if (!StartDate) {
        return res.status(400).send({
          status: false,
          message:  "Please select start date!",
        });
      }else if (!CompletionDate) {
        return res.status(400).send({
          status: false,
          message: "Please select completion date!",
        });
      }else if (!Financial) {
        return res
          .status(400)
          .send({ status: false, message: "Please Enter Financial" });
      } else if (!Pysical) {
        return res
          .status(400)
          .send({ status: false, message: "Please Enter Pysical" });
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
    const recordExists = await checkIfMordenExists(
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
    modernisationprojectsData,
};
