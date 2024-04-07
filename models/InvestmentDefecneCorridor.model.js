module.exports = (sequelize, Sequelize, DataTypes) => {
    const InvestmentDefecneCorridor = sequelize.define("ddpdashboard_InvestmentDefecneCorridor", {
      CorridorID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
        InvestmentTarget: {
        type: DataTypes.FLOAT(11),
        allowNull: true,
      },
      InvestmentMade: {
        type: DataTypes.FLOAT(11),
        allowNull: true,
      },
      Already_attached_investment: {
        type: DataTypes.FLOAT(11),
        allowNull: true,
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
      State: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },{
      timestamps:false
    });
    return InvestmentDefecneCorridor;
  };
   
  