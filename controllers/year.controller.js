const db = require("../models");
const tblYear = db.tblYear;

const addFinancialYear =async (req,res)=>{
  try {
    const { Year} = req.body;
    const userId = req.userId;
    await tblYear.create({
      Year: Year,
      ModifiedBy: userId,
    });
    return res
      .status(200)
      .send({ status: true, message: "Year Added Successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}
const getAllfinancialYear = async (req, res) => {
  try {
    const result = await tblYear.findAll({
      attributes: ["YearID", "Year"],
    });
    if (result.length == 0) {
      return res
        .status(200)
        .send({ status: true, message: "No data found", data: result });
    }
    return res
      .status(200)
      .send({ status: true, message: "Data found successfully", data: result });
  } catch (error) {
    return res.status(500).send({ status: true, message: error.message });
  }
};

const getFinancialYearById = async (req, res) => {
  try {
    const {yearID } = req.params;
    const YearExists = await tblYear.findByPk(yearID, {
      attributes: ["Year"],
    });

    if (!YearExists) {
      return res.status(404).send({
        status: false,
        message: `Data ${yearID} not found`,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Data found Successfully",
      data: YearExists,
    });
  } catch (error) {
    return res.status(500).send({ status: true, message: error.message });
  }
};

const updateFyYearData = async (req, res) => {
  try {
    const { yearID } = req.params;
    const { Year, YearDefenceOffsets, YearMake2Projects } = req.body;

    const YearExists = await tblYear.findByPk(yearID);

    if (!YearExists) {
      return res.status(404).send({
        status: "error",
        message: `Data ${yearID} not found`,
      });
    }

    await tblYear.update(
      {  Year, YearDefenceOffsets, YearMake2Projects },
      { where: { yearID } }
    );

    return res.status(200).send({
      status: true,
      message: `Organization updated successfully`,
    });
  } catch (error) {
    return res.status(500).send({ status: true, message: error.message });
  }
};

const deleteYear = async(req,res)=>{
  try {
    const { yearID } = req.params;
    const YearExists = await tblYear.findByPk(yearID);

    if (!YearExists) {
      return res.status(404).send({
        status: "error",
        message: `Data ${yearID} not found`,
      });
    }
    await tblYear.destroy(
      {
        where: {
          yearID: yearID,
        },
      }
    );
    return res
      .status(200)
      .send({ status: true, message: "Year deleted successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}
module.exports = {
  addFinancialYear,
  getAllfinancialYear,
  getFinancialYearById,
  updateFyYearData,
  deleteYear
};
