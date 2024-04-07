const db = require("../../models");
const FyYear = db.tblYear;
const Organisation = db.organisation;
const IdexProject = db.idexmakeproject;

const checkIfIdexProjectExists = async (
  organisationID,
  ProjectID,
  ProjectName,
  StartDate,
  EndDate
) => {
  try {
    const existingRecord = await IdexProject.findOne({
      where: {
        OrganisationID: organisationID,
        StartDate: StartDate,
        EndDate: EndDate,
      },
    });

    return !!existingRecord; // Return true if the record exists, false otherwise
  } catch (error) {
    console.error("Error checking if record exists:", error);
    return false;
  }
};

const addidexmakeprojectData = async (req, res, next) => {
  try {
    const {
      OrganisationID,
      ProjectID,
      ProjectName,
      ValueInCr,
      StartDate,
      EndDate,
      Financial,
      Pysical,
      Remarks,
    } = req.body;
    if (!OrganisationID) {
      return res
        .status(400)
        .send({ status: false, message: "Please select organisation" });
    } else if (!ProjectID) {
      return res
        .status(400)
        .send({ status: false, message: "Please select Project" });
    } else if (!ProjectName) {
      return res
        .status(400)
        .send({ status: false, message: "Please select Project" });
    } else if (!ValueInCr) {
      return res.status(400).send({
        status: false,
        message: "Please Enter Value in Cr!",
      });
    } else if (!StartDate) {
      return res.status(400).send({
        status: false,
        message: "Please select start date!",
      });
    } else if (!EndDate) {
      return res.status(400).send({
        status: false,
        message: "Please select end date!",
      });
    } else if (!Financial) {
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

    if (!/^\d{4}-\d{2}$/.test(StartDate)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Valid Start Date" });
    }
    if (!/^\d{4}-\d{2}$/.test(EndDate)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Valid End Date" });
    }

    if (new Date(EndDate) <= new Date(StartDate)) {
      throw new Error("EndDate must be greater than StartDate");
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
    const recordExists = await checkIfIdexProjectExists(
      OrganisationID,
      ProjectID,
      ProjectName,
      StartDate,
      EndDate
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
  addidexmakeprojectData,
};
