const crypto = require('crypto');
module.exports = (sequelize, Sequelize, DataTypes) => {
  const prProduction = sequelize.define("ddpdashboard_productionPerformance", {
    ProductionID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    YearID: {
      type: Sequelize.STRING,   
      allowNull: false,
      unique: true,
    },
    OrganisationID: {
      type: Sequelize.STRING,    
      allowNull: false,
      unique: true,
    },   
    Cumulative: {
      type: DataTypes.STRING,  
      allowNull: false,    
    },
    Quarter: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }, 
    EncryptedHash: { // New field for storing the hash value
      type: Sequelize.STRING,
     
      unique: true, // Define unique constraint   
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
    // Define a composite unique constraint for OrganisationID, YearID, and Quarter
    indexes: [
      {
        unique: true,
        fields: ['OrganisationID', 'YearID', 'Quarter'],
      },
    ],
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  });
  prProduction.beforeCreate(async (instance, options) => {
    const { OrganisationID, YearID, Quarter } = instance;
    const concatenatedData = `${OrganisationID}.${YearID}.${Quarter}`;
    const hash = crypto.createHash('sha256').update(concatenatedData).digest('hex');
    instance.EncryptedHash = hash;
  });    
  return prProduction;   
};
