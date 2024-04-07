module.exports = (sequelize, Sequelize, DataTypes) => {
    const indigenization = sequelize.define("ddpdashboard_indigenization", {
        IndigenizationID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrganisationID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Component: {
        type: Sequelize.TEXT,
        allowNull: false,   
      },
      TypePlatform: {
        type: DataTypes.TEXT,   
        allowNull: false,
      },
      ValueInCr: {
        type: DataTypes.FLOAT,
        allowNull: false,   
      },
      StartDate: {  
          type: DataTypes.STRING,   
          allowNull: false,
      },
      EndDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Financial: {
      type: DataTypes.TEXT, // Cr.  
      allowNull: false,    
    }, 
    Pysical: {
      type: DataTypes.TEXT, //Cr.
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
    return indigenization;
  };
  