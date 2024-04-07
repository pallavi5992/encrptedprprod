const db = require("../../models");
const MakeProject1 = db.makeProject1;

const checkIfProdExists = async (ProjectName) => {
  try {
    const existingRecord = await MakeProject1.findOne({
      where: {
        ProjectName: ProjectName,
      },
    });

    return !!existingRecord; // Return true if the record exists, false otherwise
  } catch (error) {
    console.error("Error checking if record exists:", error);
    return false;
  }
};
const addmakeProject1 = async (req, res, next) => {
  try {
    const { SHQ, ProjectName, Qauntity, TentativeCost, AIP_Date, Remarks } =
      req.body;

    if (!SHQ) {
      return res
        .status(400)
        .send({ status: false, message: "Please select SHQ!" });
    } else if (!ProjectName) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Project Name!" });
    } else if (!Qauntity) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter the Qauntity!" });
    } else if (parseInt(Qauntity) < 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter valid Qauntity" });
    } else if (!TentativeCost) {
      return res
        .status(400)
        .send({ staus: false, message: "Please Enter the TentativeCost!" });
    } else if (parseInt(TentativeCost) < 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter valid TentativeCost" });
    } else if (!AIP_Date) {
      return res
        .status(400)
        .send({ staus: false, message: "Please select the Date!" });
    } else if (!Remarks) {
      return res
        .status(400)
        .send({ staus: false, message: "Please Enter the Remarks!" });
    }

    const recordExists = await checkIfProdExists(ProjectName);
    if (recordExists) {
      return res
        .status(400)
        .send({ status: false, message: "Record already exists." });
    }

    next();
  } catch (error) {
    return res.status(500).send({ staus: false, message: error.message });
  }
};

const updatemakeProject1 = async (req, res, next) => {
  try {
    const { SHQ, ProjectName, Qauntity, TentativeCost, AIP_Date, Remarks } =
      req.body;

    if (!SHQ) {
      return res
        .status(400)
        .send({ status: false, message: "Please select SHQ!" });
    } else if (!ProjectName) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Project Name!" });
    } else if (!Qauntity) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter the Qauntity!" });
    } else if (parseInt(Qauntity) < 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter valid Qauntity" });
    } else if (!TentativeCost) {
      return res
        .status(400)
        .send({ staus: false, message: "Please Enter the TentativeCost!" });
    } else if (parseInt(TentativeCost) < 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter valid TentativeCost" });
    } else if (!AIP_Date) {
      return res
        .status(400)
        .send({ staus: false, message: "Please select the Date!" });
    } else if (!Remarks) {
      return res
        .status(400)
        .send({ staus: false, message: "Please Enter the Remarks!" });
    }

 

    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
module.exports = {
  addmakeProject1,
  updatemakeProject1,
};
