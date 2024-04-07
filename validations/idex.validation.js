const addIdexstartupdefence =async(req, res, next)=>{
    try {
        const{ 
            StartUp_name,
            Challenge_Category,
            Challenge,
            LocationId,
            Service
        }=req.body
            if(!StartUp_name){
                return res
                .status(400)
                .send({status:false, message:"Please select Startup name!"});
              }else if(!Challenge_Category){
                return res
                .status(400)
                .send({status: false, message:"Please Enter Challenge Category!"})
            }else if(!Challenge){
                return res 
                .status(400)
                .send({status: false, message:"Please select Challenge!"})
            }else if (!LocationId){
                return res
                .status(400)
                .send({status:false, message:"Please select Location!"})
            }else if (!Service){
                return res
                .status(400)
                .send({status:false, message:"Please select Service!"})
            }
            next()
            } catch (error) {
                return res .status(500) .send({status:false , message:error.message})
                
            }
}
module.exports={
    addIdexstartupdefence
}