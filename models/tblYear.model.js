module.exports = (sequelize, Sequelize, DataTypes) => {
    const tblYear = sequelize.define("ddpdashboard_tblyears", {
      YearID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Year: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      YearDefenceOffsets: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      YearMake2Projects: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ModifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
    return tblYear;
  };
  