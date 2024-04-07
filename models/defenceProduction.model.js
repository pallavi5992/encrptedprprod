module.exports=(sequelize, Sequelize, DataTypes)=>{
    const DefenceProduction =sequelize.define("ddpdashboard_Defenceproduction",{
        DefenceProductionID:{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true

        },
        YearID:{
            type:Sequelize.INTEGER,
            allowNull: false,
        },
        DPSU:{
            type:Sequelize.FLOAT,
            allowNull: false,
        },
        YearID:{
            type:Sequelize.FLOAT,
            allowNull: false,
        },
        OFB:{
            type:Sequelize.FLOAT,
            allowNull: false,
        },
        Other_PSU:{
            type:Sequelize.FLOAT,
            allowNull: false,
        },
        Defence_Private_Companies:{
            type:Sequelize.FLOAT,
            allowNull: false,
        },
        Deleted:{
            type:Sequelize.ENUM("0","1"),
            comment:"0-notDeleted,1-deleted",
            defaultValue:"0"
         },
        ModifiedOn: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          ModifiedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          IPAddress: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          Quarter:{
            type: DataTypes.TEXT,
            allowNull: true
          }, 
           Quarter_Peroid:{
            type: DataTypes.TEXT,
            allowNull: true
          }
    },{
        timestamps:false
    })
    return DefenceProduction

}