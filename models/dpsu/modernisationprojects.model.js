module.exports = (sequelize, Sequelize, DataTypes) => {
  const modernisationprojects = sequelize.define(
    "ddpdashboard_modernisationprojects",
    {
      ModernProjectID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrganisationID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      MajorProjects: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ValueCr: {
        type: DataTypes.FLOAT,
        allowNull: false, 
      },
      StartDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CompletionDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Financial: {
        type: DataTypes.FLOAT,   
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
    },
    {
      // don't add the timestamp attributes (updatedAt, createdAt)
      timestamps: false,

      // If don't want createdAt
      createdAt: false,

      // If don't want updatedAt
      updatedAt: false,

      // your other configuration here
    }
  );
  return modernisationprojects;
};
