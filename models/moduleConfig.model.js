module.exports = (sequelize, Sequelize, DataTypes) => {
  const ModuleConfig = sequelize.define("ddpdashboard_moduleConfiguration", {
    ConfigID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    ModuleID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    DataYearID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    Target: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    TargetYearID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    DataRefershFrequency: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    ModifiedOn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    As_On_Date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    StartupEngaged: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ContractsSigned: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ConsolidatedMonth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    TargetFor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return ModuleConfig;
};
