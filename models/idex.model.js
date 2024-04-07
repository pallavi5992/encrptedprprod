module.exports = (sequelize, Sequelize, DataTypes) => {
    const IDexStartup = sequelize.define("ddpdashboard_IdexStartupDefenceList", {
      StartupID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      StartUp_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Challenge_Category: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Challenge: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      LocationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Service: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  
      Deleted: {
        type: Sequelize.ENUM("0", "1"),
        comment: "0-notDeleted,1-deleted",
        defaultValue: "0",
      },
      ModifiedOn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ModifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      IPAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps:false
    }
    );
    return IDexStartup;
  };
  