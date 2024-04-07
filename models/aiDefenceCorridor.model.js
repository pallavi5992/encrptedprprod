module.exports = (sequelize, Sequelize, DataTypes) => {
    const AIdefenceCorridor = sequelize.define("ddpdashboard_AIdefencecorridor", {
      AIID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      YearID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  
      OrganisationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
     Project: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Completed: {
        type: DataTypes.FLOAT(11),
        allowNull:true
  
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
    });
    return AIdefenceCorridor;
  };
  