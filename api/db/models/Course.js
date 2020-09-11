//.............................................Define the table/fields....................................//

const Sequelize = require('sequelize');


module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    userId:{
      type: Sequelize.INTEGER,
      references:{
          model: 'Users',
          key: 'id'
      }
    },

    title:{
       type: Sequelize.STRING,
       allowNull:false,
       validate:{
         notNull:{
           msg: 'Please provide a value for "title" '
         },
         notEmpty: {
           msg: 'Please provide a value for "title" '
         }
       } 
    },

    description:{
        type: Sequelize.TEXT,
        allowNull: false,
        validate:{
          notNull:{
            msg: 'Please provide a value for "description" '
          },
          notEmpty: {
            msg: 'Please provide a value for "description" '
          }
        }
    },
    
    estimatedTime:{
        type: Sequelize.STRING,
        allowNull: true
    },

    materialsNeeded:{
        type: Sequelize.STRING,
        allowNull: true
    }

    

  }, { 
    sequelize 
  });

//Relate to User
Course.associate = (models) => {
  // define association between tables
  // a "course" belongs to a single "user"
  Course.belongsTo(models.User, {
    foreignKey: {
      fieldName: 'userId',
      allowNull: false
    }
  });
};

  return Course;
};