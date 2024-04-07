
module.exports = (sequelize, Sequelize, DataTypes) => {
    const mrgsConsolidatedData = sequelize.define("ddpdashboard_MRGSConsolidatedData", {
        ID: {
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
   
        YearID:{
            type:Sequelize.INTEGER,
            allowNull: false,
        },
        Organization:{
            type:DataTypes.STRING,
            allowNull:false

        },
        IPRTarget: {  
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        IPRFiled: {  
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        IPRGranted: {  
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        
        ModifiedOn:{
            type:DataTypes.DATE,
            allowNull:false
        },
        ModifiedBy:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        IPAddress: {
            type: DataTypes.STRING,
            allowNull: true,
          },
        }) 
    return mrgsConsolidatedData
}

     
   
       
   
     

   