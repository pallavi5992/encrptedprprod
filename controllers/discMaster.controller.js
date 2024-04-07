const db = require("../models");
const DiscMaster = db.discMaster;

const addDiscMaster = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "Plaese enter Disc master name!" });
    }
    const isDiscMasterExist = await DiscMaster.findOne({
      where: {
        Name: name,
      },
    });
    if (isDiscMasterExist) {
      return res
        .status(400)
        .send({ status: false, message: "Disc master alreday exist!" });
    }

    await DiscMaster.create({
      Name: name,
    });
    return res
      .status(200)
      .send({ status: true, message: "Disc Master added successfully!" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.massage });
  }
};

const getAllDiscMaster = async (req, res) => {
  try {
    const allDiscData = await DiscMaster.findAll({
      attributes:["id",["Name","name"]]
    });
    return res
      .status(200)
      .send({
        status: true,
        massage: "Disc Master found successfully",
        data: allDiscData,
      });
  } catch (error) {
    return res.status(500).send({ status: false, massage: error.massage });
  }
};

module.exports = {
  addDiscMaster,
  getAllDiscMaster,
};
