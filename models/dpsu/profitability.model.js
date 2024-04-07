module.exports = (sequelize, Sequelize, DataTypes) => {
    const profitability = sequelize.define("ddpdashboard_profitability", {
        ProfitabilityID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrganisationID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      YearID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      PreviousFY:{
        type:  DataTypes.STRING,  
        allowNull: false,
      },
      Quarter: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      Remarks: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Deleted: { 
        type: Sequelize.ENUM("0", "1"),
        comment: "0-deleted,1-notDeleted",
        allowNull: true,
      },
      ModifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {

      // don't add the timestamp attributes (updatedAt, createdAt)
      timestamps: false,
    
      // If don't want createdAt
      createdAt: false,  
    
      // If don't want updatedAt
      updatedAt: false,
    
      // your other configuration here
    
    });
    return profitability;
  };
  