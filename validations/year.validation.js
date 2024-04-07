const db = require("../models");
const tblYear = db.tblYear;
const addFy = async (req, res, next) => {
  try {
    const { Year } = req.body;
    if (!(/^\d{4}-\d{4}$/).test(Year)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Valid Financial Year" });
    } 
    
    const isYearExist = await tblYear.findOne({
      where: {
        Year: Year,
      },
    });
    if (isYearExist) {
      return res
        .status(400)
        .send({ status: false, message: "Year address already exist!" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = {
    addFy
};

