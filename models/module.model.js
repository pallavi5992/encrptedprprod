module.exports=(sequelize, Sequelize, DataTypes)=>{
    const Module = sequelize.define("ddpdashboard_module",{
        ModuleID:{
            type:Sequelize.INTEGER,
            primaryKey: true,
           autoIncrement:true
        },
        ModuleName:{
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
        
        
    });
    
    return Module ;
}
    
    























   


