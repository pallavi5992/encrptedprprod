const db = require("../../models");
const FyYear = db.tblYear;
const Organisation = db.organisation;
const orderBook = db.orderBook;

const checkIfOrderExists = async (organisationID, SelectedMonth) => {
  try {
    const existingRecord = await orderBook.findOne({
      where: {
        OrganisationID: organisationID,
        SelectedMonth: SelectedMonth,
      },
    });

    return !!existingRecord; // Return true if the record exists, false otherwise
  } catch (error) {
    console.error("Error checking if record exists:", error);
    return false;
  }
};
const addOrderBookPosition = async (req, res, next) => {
  try {
    const {
      OrganisationID,
      NoOfOrderBookFrom,
      NoOfOrderBookTo,
      SelectedMonth,
      Remarks,
    } = req.body;
    if (!OrganisationID) {
      return res
        .status(400)
        .send({ status: false, message: "Please select organisation" });
    } else if (!NoOfOrderBookFrom) {
      return res.status(400).send({
        status: false,
        message: "Please Enter Value Of Order Book!",
      });
    } else if (!NoOfOrderBookTo) {
      return res.status(400).send({
        status: false,
        message: "Please Enter Value Of Order Book!",
      });
    } else if (!SelectedMonth) {
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

    if (!/^\d{4}-\d{2}$/.test(SelectedMonth)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Valid Year Month" });
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
    const recordExists = await checkIfOrderExists(
      OrganisationID,
      SelectedMonth
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
const updateOrderBookPosition = async (req, res, next) => {
  try {
    const { OrganisationID, NoOfOrderBookFrom, NoOfOrderBookTo,SelectedMonth, Remarks } = req.body;
    if (!OrganisationID) {
      return res
        .status(400)
        .send({ status: false, message: "Please select organisation" });
    } else if (!NoOfOrderBookFrom) {
      return res.status(400).send({
        status: false,
        message: "Please Enter Value Of Order Book!",
      });
    } else if (!NoOfOrderBookTo) {
      return res.status(400).send({
        status: false,
        message: "Please Enter Value Of Order Book!",
      });
    } else if (!SelectedMonth) {
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

    if (!/^\d{4}-\d{2}$/.test(SelectedMonth)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Valid Year Month" });
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
    const recordExists = await checkIfOrderExists(
      OrganisationID,
      SelectedMonth
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
  addOrderBookPosition,
  updateOrderBookPosition
};
