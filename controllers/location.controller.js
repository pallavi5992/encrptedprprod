const db = require("../models");
const Location = db.location;

const addLoaction = async (req, res) => {
  try {
    const { locationName } = req.body;
    if (!locationName) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter location name" });
    }
    const isLocationExist = await Location.findOne({
      where: {
        LocationName: locationName,
      },
    });
    if (isLocationExist) {
      return res
        .status(400)
        .send({ status: false, message: "Location name already taken" });
    }
    await Location.create({
      LocationName: locationName,
      Deleted: "0",
      ModifiedOn: Date.now(),
      ModifiedBy: req.userId || null,
    });
    return res
      .status(200)
      .send({ status: true, message: "Location addedd successfully!" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getAllLocation = async (req, res) => {
  try {

   const result= await Location.findAll({
      attributes:['LocationId','LocationName']
    });

    return res
      .status(200)
      .send({ status: true, message: " Data found successfully!",data:result });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.massage });
  }
};

module.exports={
    addLoaction,
    getAllLocation
}
