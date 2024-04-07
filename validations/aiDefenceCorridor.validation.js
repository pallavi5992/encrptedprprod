const addAidefencecorridor =async(req, res, next)=>{
    try {
        const{ 
            YearID,
           OrganisationID,
          Project,
          Completed  
        }=req.body
            if(!YearID){
                return res
                .status(400)
                .send({status:false, message:"Please select Year!"});
              }else if(!OrganisationID){
                return res
                .status(400)
                .send({status: false, message:"Please select Organisation!"})
            }else if(!Project){
                return res 
                .status(400)
                .send({status: false, message:"Please Enter the Project Name!"})
            }else if (!Completed){
                return res
                .status(400)
                .send({status:false, message:"Please Enter the Completed!"})
            }
            next()
            } catch (error) {
                return res .status(500) .send({status:false , message:error.message})
                
            }
}
module.exports={
    addAidefencecorridor
}