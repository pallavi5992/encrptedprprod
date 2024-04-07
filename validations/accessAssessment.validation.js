const db=require("../models");
const User=db.user;
const Module=db.module

const addAccess=async(req,res,next)=>{
    try {
        const {UserID, ModuleID,} = req.body;
        if(!UserID){
            return res.status(400).send({ status: false, message: "Please enter user name" });
        }else if(!ModuleID){
            return res.status(400).send({ status: false, message: "Please enter module name" });
        };
        if(ModuleID.length==0) {
            return res.status(400).send({ status: false, message: "Please enter module name!" });
        };
        const isUserIdExist=await User.findOne({
            where:{
                UserId:parseInt(UserID),
                Deleted:"1"
            }
        });
        if(!isUserIdExist) {
            return res.status(400).send({ status: false, message: "User not exist!" });
        };
        
       if(ModuleID.length>0){
           for(let i=0;i<ModuleID.length;i++){
               const isModuleIdExist=await Module.findOne({
                   where:{
                       ModuleID:parseInt(ModuleID[i])
                   }
               })
               if(!isModuleIdExist) {
                   return res.status(400).send({ status: false, message: "Module name not exist!" });
               };
   
           }


           
       };
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports={
    addAccess
}