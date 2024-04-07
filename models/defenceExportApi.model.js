module.exports = (sequelize, Sequelize, DataTypes) => {
  const DefenceExportApi = sequelize.define("ddpdashboard_defenceexportApi", {
    DefenceExportID: {
      type: Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement: true,
      },
      fin_year: {
      type: Sequelize.FLOAT(11),
      allowNull: false,
    },
    dpsu: {
      type: Sequelize.FLOAT(11),
      allowNull: false,
    },
    cmy_cat: {
      type: Sequelize.FLOAT(11),
      allowNull: false,
    },
    privatecompanies: {
      type: Sequelize.FLOAT(11),
      allowNull: false,
    },
    rdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sec_str: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    qtr: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    private_company_offline: {
      type: DataTypes.FLOAT(11),
      allowNull: true,
    },
    ModifiedOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ModifiedBy: {
      type: DataTypes.FLOAT(11),
      allowNull: true,
    },
    IPAddress: {
      type: DataTypes.FLOAT(11),
      allowNull: true,
    },
    ContractValue:{
      type: DataTypes.FLOAT(11),
      allowNull: true,
    }
  });
  return DefenceExportApi;
};