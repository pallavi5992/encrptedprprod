module.exports=(sequelize, Sequelize, DataTypes) => {
    const DiscMaster = sequelize.define("ddpdashboard_discMaster", {
      id: {
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
      },
      Name: {
        type:DataTypes.STRING,
        allowNull:false
      },
    
    });
    return DiscMaster;
  };
  



  