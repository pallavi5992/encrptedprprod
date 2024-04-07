module.exports = (sequelize, Sequelize, DataTypes) => {
    const DefenceChallange = sequelize.define("ddpdashboard_defenceChallange", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ChallangeName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DiscID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      
    });
    return DefenceChallange;
  };
  