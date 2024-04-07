module.exports = (sequelize, Sequelize, DataTypes) => {
    const MakeProject2Dpsu = sequelize.define("ddpdashboard_makeProject2DPSU", {
      M2POFBID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrganisationID: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      itemCode_PartNo: {
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
      EOI_Date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      Contract_Date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      Withdrawn_On: {
        type: DataTypes.DATE,
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
    });
    return MakeProject2Dpsu;
  };