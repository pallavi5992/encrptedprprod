
module.exports = (sequelize, Sequelize, DataTypes) => {
    const MakeProject = sequelize.define("ddpdashboard_makeProject", {
        M2PID: {
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
   
        YearID:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        MonthID:{
            type: Sequelize.INTEGER,
            allowNull: true,
        },
 
        AIP_Accorded_DPP: {  
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        AIP_Dropped_DPP: {  
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        AIP_Accorded_OFB: {  
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        AIP_Dropped_OFB: {  
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        Deleted:{
            type:Sequelize.ENUM("0","1"),
            comment:"0-notDeleted,1-deleted",
            defaultValue:"0"
         },
        ModifiedOn:{
            type:DataTypes.DATE,
            allowNull:true
        },
        ModifiedBy:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        IPAddress: {
            type: DataTypes.STRING,
            allowNull: true,
          },
        },
        {
            timestamps:false
        }) 
    return MakeProject
}
        

     
   
       
   
     

   