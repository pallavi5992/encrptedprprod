const db = require("../models");
const DefenceChallange = db.defenceChallange;
const DiscMaster=db.discMaster

const addDefenceChallange = async (req, res,next) => {
  try {
    const { challangeName,discId } = req.body;
    console.log(req.body)
    if(!challangeName){
        return res
        .status(400)
        .send({ status: false, message: "Please enter challange name!" });
    }
    else if(!discId){
        return res
        .status(400)
        .send({ status: false, message: "Please enter disc master!" });
    }
    const isDefenceChallangeExist = await DefenceChallange.findOne({
      where: {
        ChallangeName: challangeName,
       
      },
    });
    if (isDefenceChallangeExist) {
      return res
        .status(400)
        .send({ status: false, message: "Defence challange alreday exist!" });
    }
    const isDiscIdExist=await DiscMaster.findOne({
        where:{
            id:parseInt(discId)
        }
    });
    if(!isDiscIdExist){
        return res
        .status(400)
        .send({ status: false, message: "Disc master not exist" });
    };
    next()

  } catch (error) {
    return res.status(500).send({ status: false, message: error.massage });
  }
};


module.exports={
    addDefenceChallange
}