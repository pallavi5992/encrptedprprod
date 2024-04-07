module.exports = (sequelize, Sequelize, DataTypes) => {
    const Role = sequelize.define("ddpdashboard_roles", {
        RoleId: {
            type:Sequelize.INTEGER,
            primaryKey: true,
           autoIncrement:true
        },
        Role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Remarks: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isActive:{
            type:Sequelize.ENUM("0","1"),
            comment:"0-pending,1-active",
            defaultValue:"1"
        },
        CreatedOn:{
            type:Sequelize.DATE,
            allowNull: false
        },
        CreatedBy:{
            type:Sequelize.INTEGER,
            allowNull: false
        },
        ModifiedOn:{
            type:DataTypes.DATE,
            allowNull: true
        },
        ModifiedBy:{
            type:DataTypes.DATE,
            allowNull: true
        }
       
    }) 
    return Role
}