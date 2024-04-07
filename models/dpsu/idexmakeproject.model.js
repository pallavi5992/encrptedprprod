module.exports = (sequelize, Sequelize, DataTypes) => {
    const idexmakeproject = sequelize.define("ddpdashboard_idexmakeproject", {
        IdexMakeID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrganisationID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ProjectID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ProjectName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ValueInCr: {
        type: Sequelize.INTEGER,
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Pysical: {
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
    },{

      // don't add the timestamp attributes (updatedAt, createdAt)
      timestamps: false,
    
      // If don't want createdAt
      createdAt: false,  
    
      // If don't want updatedAt
      updatedAt: false,
    
      // your other configuration here
    
    });
    return idexmakeproject;
  };
  