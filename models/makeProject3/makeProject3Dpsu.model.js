module.exports = (sequelize, Sequelize, DataTypes) => {
    const MakeProject3Dpsu = sequelize.define("ddpdashboard_makeProject3DPSU", {
      M2POFBID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrganisationID: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
      itemCode_PartNo: {
        type: DataTypes.STRING,
        allowNull: true,
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
          allowNull: true,
        },
      Contract_Date: {
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
    });
    return MakeProject3Dpsu;
  };