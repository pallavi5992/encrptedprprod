module.exports = (sequelize, Sequelize, DataTypes) => {
    const DefenceoffsetYearlyData = sequelize.define("ddpdashboard_DefenceOffsetyearlyData", {
        ID: {
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        Year: {  
            type: DataTypes.STRING,
            allowNull: false,
        },
        YearID:{
            type:Sequelize.INTEGER,
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
        offsets_obligation: {  
            type: Sequelize.FLOAT,
            allowNull: false,
        },
    
          claim_rejected_by_domw: {  
            type: Sequelize.FLOAT,
            allowNull: false,
        }
    },
    {
        timestamps: false,
      }
    ) 
    return DefenceoffsetYearlyData

 
        
}