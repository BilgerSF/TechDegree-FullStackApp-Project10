//.............................................Define the table/fields....................................//

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    firstName:{ 
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          notNull:{
            msg: 'Please provide a value for "firstName" '
          },
          notEmpty: {
            msg: 'Please provide a value for "firstName" '
          }
        } 
    },
    
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          notNull:{
            msg: 'Please provide a value for "lastName" '
          },
          notEmpty: {
            msg: 'Please provide a value for "lastName" '
          }
        } 
    },

    emailAddress:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          notNull:{
            msg: 'Please provide a value for "password" '
          },
          notEmpty: {
            msg: 'Please provide a value for "password" '
          }
        } 
    },

    password:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          notNull:{
            msg: 'Please provide a value for "password" '
          },
          notEmpty: {
            msg: 'Please provide a value for "password" '
          }
        } 
    }



  }, { 
    
    sequelize 
  });

//Create relationship between Course and User. One-to-Many relationship 
User.associate = (models) => {
  // define association between tables
  // a "user" has many "courses"
  User.hasMany(models.Course, {
    foreignKey: {
      fieldName: 'userId', 
      allowNull: false,
    },
  });
};
  return User;
};