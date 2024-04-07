module.exports=(sequelize, Sequelize, DataTypes) => {
    const Access = sequelize.define("ddpdashboard_accessassignment", {
      AccessID: {
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
      },
      UserID: {
        type:Sequelize.INTEGER,
        allowNull:false
      },
      ModuleID: {
        type:Sequelize.JSON,
        allowNull:false,
      },
      ModifiedOn:{
        type:DataTypes.DATE,
        allowNull:false
     }, 
     ModifiedBy:{
      type:DataTypes.INTEGER,
       allowNull:true
      },
    });
    return Access;
  };
  



  