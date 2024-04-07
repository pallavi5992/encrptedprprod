const db = require("../../models");
const FyYear = db.tblYear;
const Organisation = db.organisation;
const Project = db.newproject

const checkIfProjectExists = async (organisationID, ProjectName,ProjectValue) => {
  try {
    const existingRecord = await Project.findOne({
      where: {
        OrganisationID: organisationID,
        ProjectName:ProjectName,
        ProjectValue:ProjectValue,

      },
    });

    return !!existingRecord; // Return true if the record exists, false otherwise
  } catch (error) {
    console.error("Error checking if record exists:", error);
    return false;
  }
};
const addprojectData = async (req, res, next) => {
  try {
    const {
      OrganisationID,  
      ProjectName,
      ProjectValue,
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
    } else if (!ProjectName) {
      return res.status(400).send({
        status: false,
        message: "Please select project name!",
      });
    } else if (!ProjectValue) {
      return res.status(400).send({
        status: false,
        message: "Please Enter Value Of Project!",
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
    }  else if (!Remarks) {
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
    const recordExists = await checkIfProjectExists(
      OrganisationID, ProjectName,ProjectValue
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
    addprojectData,
};
