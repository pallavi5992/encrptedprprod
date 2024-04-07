const db = require("../models");
const Roles = db.role;

exports.addRole = async (req, res) => {
  try {
    await Roles.create({
      Role: req.body.Role,
      isActive:req.body.isActive||"1",
      CreatedBy:req.body.CreatedBy||1,
      CreatedOn:new Date()
    });
    return res
      .status(200)
      .send({ status: true, message: "Role added successfully!" });
  } catch (error) {
    return res
      .status(500)
      .send({ status: true, message: error.message });
  }
};

exports.getAllRole=async(req,res)=>{
    try {
        const result=await Roles.findAll({
            where:{
                isActive:"1"
            }
        });
        if(result.length==0){
            return res.status(200).send({status:true,message:"No data found",data:result})
        }
        return res.status(200).send({status:true,message:"Data found successfully",data:result})
    } catch (error) {
        return res
        .status(500)
        .send({ status: true, message: error.message });
    }
}
