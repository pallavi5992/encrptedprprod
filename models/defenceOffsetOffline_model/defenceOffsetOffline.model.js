
module.exports = (sequelize, Sequelize, DataTypes) => {
    const DefenceoffsetOffine = sequelize.define("ddpdashboard_defenceOffsetOffline", {
        ID: {
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        contractid:{
            type:Sequelize.INTEGER,
            allowNull: false,
        },
        oem_name: {  
            type: DataTypes.STRING,
            allowNull: false,
        },
        contract_short: {  
            type: DataTypes.STRING,
            allowNull: false,
        },
        contract_description: {  
            type: DataTypes.STRING,
            allowNull: false,
        },
        claims_submitted_cgda: {  
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        incomplete_claims_clarification_sought: {  
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        under_examination_by_domw: {  
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        under_examination_by_cgda: {  
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        claims_verified: {  
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        claims_rejected: {  
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        DataStatus: {  
            type: DataTypes.STRING,
            allowNull: false,
        },
  
       ModifiedOn:{
            type:DataTypes.DATE,
            allowNull:false
        },
        ModifiedBy:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        IPAddress: {  
            type: DataTypes.STRING,
            allowNull: false,
        },
        claim_rejected_by_domw: {  
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        
    }) 
    return DefenceoffsetOffine
}