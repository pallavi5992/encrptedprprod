module.exports = (sequelize, Sequelize, DataTypes) => {
    const UPdefenceCorridor = sequelize.define("ddpdashboard_updefencecorridor", {
      CorridorID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      State: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Sector:{
        type:Sequelize.ENUM("0","1"),
        comment:"0-PrivateSector 1-PublicSector",
        defaultValue:"1"
    },
      OrganisationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Investment: {
        type: DataTypes.FLOAT(11),
        allowNull: true,
      },
     Project: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    {
      timestamps: false,
    }
    );
    return UPdefenceCorridor;
  };
  