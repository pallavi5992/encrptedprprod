module.exports = (sequelize, Sequelize, DataTypes) => {
  const Location = sequelize.define("ddpdashboard_location", {
    LocationId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    LocationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Deleted: {
      type: DataTypes.ENUM("0", "1"),
      comment: "0-notDeleted,1-deleted",
    },
    ModifiedOn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Location;
};
