module.exports = (sequelize, Sequelize, DataTypes) => {
    const MrgsIprtarget = sequelize.define("ddpdashboard_MRGSiprtarget", {
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
        ModifiedOn: {
            type: DataTypes.DATE,
            allowNull: true,
          },
        ModifiedBy:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        IPAddress: {
            type: DataTypes.STRING,
            allowNull: true,
          },
        }) 
    return MrgsIprtarget
}
