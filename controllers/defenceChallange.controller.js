const db = require("../models");
const DefenceChallange = db.defenceChallange;

const addDefenceChallange = async (req, res) => {
  try {
    const { challangeName,discId } = req.body;

    await DefenceChallange.create({
        ChallangeName: challangeName,
        DiscID:discId
    });
    return res
      .status(200)
      .send({ status: true, message: "Defence challang added successfully!" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.massage });
  }
};
const getDefenceChallangeByDiscId = async (req, res) => {
  try {
    const { discId } = req.query;
    if(!discId){
      return res
      .status(400)
      .send({ status: false, message: "Please select disc!"});
    }

   const result= await DefenceChallange.findAll({
      where:{
        DiscID:discId
      },
      attributes:['ChallangeName','id']
    });

    return res
      .status(200)
      .send({ status: true, message: " Data found successfully!",data:result });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.massage });
  }
};

module.exports={
    addDefenceChallange,
    getDefenceChallangeByDiscId
}