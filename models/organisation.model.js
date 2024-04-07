
module.exports = (sequelize, Sequelize, DataTypes) => {
    const Organisation = sequelize.define("ddpdashboard_organisation", {
        OrganisationID: {
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        PublicSector:{
            type:Sequelize.ENUM("0","1"),
            comment:"0-PrivateSector 1-PublicSector",
            defaultValue:"1"
        },
        Code: {  
            type: DataTypes.STRING,
            allowNull: false,
        },
        Name: {  
            type: DataTypes.STRING,
            allowNull: false,
        },
  
        Deleted:{
            type:Sequelize.ENUM("0","1"),
            comment:"0-notDeleted,0-deleted",
            defaultValue:"0"
        },
        ModifiedOn:{
            type:DataTypes.DATE,
            allowNull:false
        },
        ModifiedBy:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
    }) 
    return Organisation
}

     
   
       
   
     

   