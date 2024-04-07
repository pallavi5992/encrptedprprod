module.exports = (sequelize, Sequelize, DataTypes) => {
  const MakeProject2DAP = sequelize.define("ddpdashboard_makeProject2DAP", {
    M2PDPPID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    M2PID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    SHQ: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Name_of_Project: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   AIP_Date: {
      type:DataTypes.DATE,
      allowNull: false,
    },
    AON_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    PSO_Date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Withdrawn_On: {
      type: DataTypes.DATE,
      allowNull: true,
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
  },{timestamps:false});
  return MakeProject2DAP;
};
