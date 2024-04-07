module.exports = (sequelize, Sequelize, DataTypes) => {  
    const majorachievments = sequelize.define("ddpdashboard_majorachievments", {
        MajorID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrganisationID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      MajorAchievement: {  
        type: DataTypes.STRING,
        allowNull: false,
      },
      ValueInCr: {
        type: DataTypes.FLOAT,
        allowNull: false, 
      },
      SelectedMonth: {
        type: DataTypes.STRING,
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
    },{
      // Define additional options for your model (optional)
      timestamps: false, // Add timestamps (createdAt, updatedAt) to your model (optional)
      getterMethods: {
        type: DataTypes.VIRTUAL,
        formattedSelectedMonth() {
          // Convert the selectedMonth string to a Date object
          const dateObject = new Date(this.getDataValue('SelectedMonth'));
    
          // Format the Date object to display "Month Year"
          return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(dateObject);
        },
      },
    },{   

      // don't add the timestamp attributes (updatedAt, createdAt)
      timestamps: false,
    
      // If don't want createdAt
      createdAt: false,  
    
      // If don't want updatedAt
      updatedAt: false,
    
      // your other configuration here
    
    });
    return majorachievments;
  };
  