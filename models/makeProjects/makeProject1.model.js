module.exports = (sequelize, Sequelize, DataTypes) => {
    const MakeProject1 = sequelize.define("ddpdashboard_makeProject1", {
        id: {
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
   
        SHQ:{
            type: Sequelize.STRING,
            allowNull: false
        },
        ProjectName:{
            type: Sequelize.TEXT,
            allowNull: false,
        },
 
        AIP_Date: {  
            type: Sequelize.DATE,
            allowNull: true,
        },
        Qauntity: {  
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        TentativeCost: {  
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        Remarks: {  
            type: Sequelize.TEXT,
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
    return MakeProject1
   
}
